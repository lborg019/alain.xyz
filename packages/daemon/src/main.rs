extern crate iron;
extern crate bodyparser;
#[macro_use]
extern crate serde_derive;
extern crate serde;
extern crate serde_json;
extern crate crypto;

mod hex;

use iron::prelude::*;
use iron::status;
use crypto::mac::Mac;
use serde_json::from_str;
use std::process::Command;
use std::env;
use hex::FromHex;

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

            // Create HMAC result handler from Hex value
            let header_str = String::from_utf8(header.to_vec()).unwrap();
            let header_split: Vec<&str> = header_str.split("sha1=").collect();
            let result = crypto::mac::MacResult::new(&header_split[1].from_hex().unwrap());

            // Compare HMAC of body to header signature.
            let mut hmac = crypto::hmac::Hmac::new(crypto::sha1::Sha1::new(),
                                                   config.secret.as_bytes());
            let payload_str = match req.get::<bodyparser::Raw>() {
                Ok(Some(body)) => body,
                Ok(None) => return Ok(Response::with((status::NotFound, "Missing Request Body."))),
                Err(_) => return Ok(Response::with((status::NotFound, "UTF8 Error"))),
            };

            hmac.input(payload_str.as_bytes());
            let computed_result = hmac.result();

            // Get APIRequest
            let data: APIRequest = match from_str(&payload_str.as_str()) {
                Ok(r) => r,
                Err(_) => {
                    return Ok(Response::with((status::NotFound,
                                              "Couldn't deserialize API request.")))
                }
            };

            // Check if local and request secret matches
            if computed_result == result {

                if data.refs == "refs/heads/master" {
                    Command::new("git")
                        .arg("pull")
                        .output()
                        .expect("Failed to pull from git!");
                    Command::new("npm")
                        .env("PATH", env::current_dir().unwrap().canonicalize().unwrap().join("../portfolio"))
                        .arg("start")
                        .output()
                        .expect("Failed to run NPM script!");
                }
                else {
                    return Ok(Response::with((status::NotFound,
                                              "Push was not to master branch.")))
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
