extern crate iron;
extern crate bodyparser;
#[macro_use]
extern crate serde_derive;
extern crate serde;
extern crate serde_json;
extern crate crypto;

use iron::prelude::*;
use iron::status;
use crypto::mac::Mac;
use std::process::Command;
use std::io::Read;

#[derive(Clone, Deserialize)]
struct Secret {
    secret: String,
}

#[derive(Clone, Deserialize)]
struct APIRequest {
    #[serde(rename = "ref")]
    refs: String,
}

fn main() {
    // Load the secret from ./secret.json
    let config: Secret = serde_json::from_str(include_str!("secret.json"))
        .expect("secret.json requires a 'secret' key that matches github repo!");


    Iron::new(move |req: &mut Request| {

            // Check if the Github secret exists
            let headers = req.headers.clone();
            let header = match headers.get_raw("X-Hub-Signature") {
                Some(h) => h.get(0).unwrap(),
                None => return Ok(Response::with((status::NotFound, "Missing Github Header."))),
            };

            // Compare HMAC of body to header signature.
            let mut hmac = crypto::hmac::Hmac::new(crypto::sha2::Sha256::new(),
                                                   config.secret.as_bytes());
            let mut payload_buf = vec![0u8; 1024 * 20];
            let payload_size = &req.body.read(&mut payload_buf).unwrap();

            if payload_size > &(1024 * 20) {
                return Ok(Response::with((status::NotFound, "Payload too big!")));
            }
            hmac.input(&payload_buf);
            let result = hmac.result();
            let computed_secret = result.code();

            // Get APIRequest 
            let data = match req.get::<bodyparser::Struct<APIRequest>>() {
                Ok(r) => r.unwrap(),
                Err(_) => {
                    return Ok(Response::with((status::NotFound,
                                              "Couldn't deserialize API request.")))
                }
            };

            let computed_str = String::from_utf8(computed_secret.to_vec()).unwrap();
            let header_str = String::from_utf8(header.to_vec()).unwrap();

            println!("{:?} {:?}", header_str, computed_str);

            // Check if local and request secret matches
            if header_str == computed_str {
                if data.refs == "refs/heads/master" {
                    Command::new("git pull && cd ../ && cd portfolio && npm start")
                        .output()
                        .expect("Failed to pull from git!");
                }
            } else {
                return Ok(Response::with((status::NotFound,
                                          "Github header secret didn't match config secret.")));
            }

            Ok(Response::with((status::Ok)))
        })
        .http("localhost:3030")
        .unwrap();
}
