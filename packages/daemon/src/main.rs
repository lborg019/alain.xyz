#[macro_use]
extern crate nickel;
extern crate rustc_serialize;

#[macro_use]
extern crate serde_derive;
extern crate serde;
extern crate serde_json;

use nickel::{Nickel, HttpRouter, MediaType, Response};
use nickel::status::StatusCode;
use std::process::Command;

#[derive(Serialize, Deserialize)]
struct Secret {
    secret: String,
}

fn main() {

    let mut server = Nickel::new();



    // Load the secret from ./secret.json
    let config: Secret = serde_json::from_str(include_str!("secret.json"))
        .expect("secret.json requires a 'secret' key that matches github repo!");

    server.post("/", middleware! { | req, mut res | {
      
      // Check if the Github secret exists
      let header = match req.origin.headers.get_raw("X-GitHub-Delivery") {
          Some(h) => h.get(0).unwrap().to_vec(),
          None => return {
              res.set(StatusCode::BadRequest);
              res.send("")
          }
      };

      let github_header = String::from_utf8(header).unwrap();

      // Check if the commit was to the master branch
      let data = match req.param("ref") {
          Some(r) => r,
          None => return {
                          res.set(StatusCode::BadRequest);
              res.send("")
          }
      };

      // Check if local and request secret matches
      if github_header == config.secret {
          if data == "refs/heads/master" {
            Command::new("git pull && cd ../ && cd portfolio && npm start")
                        .output()
                .expect("Failed to execute process");
          }
      }
      else {
          return {
              res.set(StatusCode::BadRequest);
              res.send("")
          }
      }
                }
      res.set(StatusCode::Ok);
      format!("")
      
    });

    server.listen("localhost:3030")
        .expect("Couldn't start Daemon...");
}
