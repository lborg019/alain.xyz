#[macro_use]
extern crate nickel;
extern crate rustc_serialize;

use nickel::{Nickel, HttpRouter};

#[derive(RustcDecodable, RustcEncodable)]
struct Secret {
    secret: String,
}

#[derive(RustcDecodable, RustcEncodable)]
struct APIRequest {
    direction: f32,
    time: u32,
}

fn main() {

    let mut server = Nickel::new();

    let mut router = Nickel::router();

    let config: Secret = json::from_str(include!("secret.json"));

    router.post("/",
                middleware! { |request, response|
      
      for header in request.headers {
          match header {
              x_github_delivery(payload) => {
                  if payload == config.secret {
                    process::command("git pull origin && cd ../portfolio && npm start");
                    format!("")
                  }
              }
              _ => return format!("")
          }
      }
      
      let data = request.json_as::<APIRequest>().unwrap();

    });

    server.utilize(router);

    server.listen("localhost:3030");
}
