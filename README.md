## Viewr

Render SVGs in a browser by making a simple post request.

### Installation

```sh
npm install -g git+https://git@github.com/fudini/viewr.git
```

### Starting server

```sh
viewr
```

Open browser at [http://localhost:9001](http://localhost:9001)

### Render

```sh
curl localhost:9001 -d '<style>#hello { color: green }</style><div id="hello">Hello</div>'
```