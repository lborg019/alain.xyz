extern crate iron;
extern crate bodyparser;
#[macro_use]
extern crate serde_derive;
extern crate serde;
extern crate serde_json;

use iron::prelude::*;
use iron::status;
use std::process::Command;

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
            let header = match req.headers.get_raw("X-GitHub-Delivery") {
                Some(h) => h.get(0).unwrap().to_vec(),
                None => return Ok(Response::with(status::NotFound)),
            };

            let github_header = String::from_utf8(header).unwrap();

            // Check if the commit was to the master branch
            let data = match req.get::<bodyparser::Struct<APIRequest>>() {
                Ok(r) => r.unwrap(),
                Err(_) => return Ok(Response::with(status::NotFound)),
            };

            // Check if local and request secret matches
            if github_header == config.secret {
                if data.refs == "refs/heads/master" {
                    Command::new("git pull && cd ../ && cd portfolio && npm start")
                        .output()
                        .expect("Failed to pull from git!");
                }
            } else {
                return Ok(Response::with(status::NotFound));
            }

            Ok(Response::with((status::Ok)))
        })
        .http("localhost:3030")
        .unwrap();
}
