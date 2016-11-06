// We should fork CreateJS and make a modern implementation of it using lebab and a transformer that converts the global namespaces to ES modules.
// It's not that simple though, they're using a lot of in house runtime transformations. What we want is the following:
// Load core libraries, load main program, when loading this talk, it requests from the backend the CreateJS module.