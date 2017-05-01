#[macro_use]
extern crate nickel;
extern crate rustc_serialize;

#[macro_use]
extern crate serde_derive;
extern crate serde;
extern crate serde_json;

use nickel::{Nickel, HttpRouter, Request, Response, MediaType};
use std::process::Command;

#[derive(Serialize, Deserialize)]
struct Secret {
    secret: String,
}

fn main() {

    let mut server = Nickel::new();

    let config: Secret = serde_json::from_str(include_str!("secret.json")).unwrap();

    server.post("/",  middleware! { | req, mut res | { 
      let header = req.origin.headers.get_raw("X-GitHub-Delivery").unwrap().get(0).unwrap().to_vec();

      let github_header = String::from_utf8(header).unwrap();

      let data = req.param("ref").unwrap();

      if github_header == config.secret {
          if data == "refs/heads/master" {
            Command::new("git pull && cd ../ && cd portfolio && npm start")
                        .output()
                .expect("failed to execute process");
          }
      }
      res.set(MediaType::Json);
      format!("{{}}")
      }
    });

    server.listen("localhost:3030");
}
