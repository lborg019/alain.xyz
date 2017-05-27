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
    commits: Vec<Commit>,
}

#[derive(Clone, Deserialize)]
struct Commit {
    added: Vec<String>,
    removed: Vec<String>,
    modified: Vec<String>,
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

					Command::new("yarn")
						.current_dir(env::current_dir()
							.unwrap()
							.join("../../")
							.canonicalize()
							.unwrap())
						.output()
						.expect("Failed to run yarn!");
						
                    // Depending on what's changed, update each package accordingly.
                    let files: Vec<String> = data.commits
                        .into_iter()
                        .fold(vec![], |mut acc, commit| {
                            acc.extend(commit.added.iter().cloned());
                            acc.extend(commit.removed.iter().cloned());
                            acc.extend(commit.modified.iter().cloned());
                            acc
                        });

                    // Update Frontend
                    if files.iter().fold(false, |acc, file| file.contains("/frontend/") || acc) {
                        Command::new("npm")
                            .arg("--prefix")
                            .arg(env::current_dir()
                                .unwrap()
                                .join("../frontend")
                                .canonicalize()
                                .unwrap())
                            .arg("start")
                            .output()
                            .expect("Failed to run NPM script!");
                    }

                    // Update Backend
                    if files.iter().fold(false, |acc, file| file.contains("/backend/") || file.contains("/frontend/") || acc) {
                        
                        Command::new("pkill")
                            .arg("node")
                            .output()
                            .expect("Failed to run proccess kill!");

                        Command::new("npm")
                            .arg("--prefix")
                            .arg(env::current_dir()
                                .unwrap()
                                .join("../backend")
                                .canonicalize()
                                .unwrap())
                            .arg("start")
                            .output()
                            .expect("Failed to run NPM script!");
                    }

                    // Update Portfolio
                    if files.iter().fold(false, |acc, file| file.contains("/portfolio/") || acc) {
                        Command::new("npm")
                            .arg("--prefix")
                            .arg(env::current_dir()
                                .unwrap()
                                .join("../portfolio")
                                .canonicalize()
                                .unwrap())
                            .arg("start")
                            .output()
                            .expect("Failed to run NPM script!");
                    }

                } else {
                    return Ok(Response::with((status::NotFound, "Push was not to master branch.")));
                }
            } else {
                return Ok(Response::with((status::NotFound,
                                          "Github header secret didn't match config secret.")));
            }

            Ok(Response::with((status::Ok, "Updated successfully.")))
        })
        .http("localhost:3030")
        .unwrap();
}
