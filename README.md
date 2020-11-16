![reactive-stack-js](https://avatars0.githubusercontent.com/u/72337471?s=75)
## ReactiveStack frontend with vue

See [reactive-stack-js](https://github.com/reactive-stack-js) for more info.

### env file

Make sure to add ```.env``` file with following content populated:
```properties
PORT = 3006
VUE_APP_API_PATH = '//localhost:3003'
VUE_APP_WS_URI = 'ws://localhost:3003/ws'

VUE_APP_FB_APP_ID = '...'
VUE_APP_GG_APP_ID = '...'
```

## Project setup
```shellsession
yarn install
```

### Compiles and hot-reloads for development
```shellsession
yarn serve
```

### Compiles and minifies for production
```shellsession
yarn build
```

### Lints and fixes files
```shellsession
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
