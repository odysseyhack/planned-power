# planned-power

## Deploy contracts on ganache

```shell
truffle migrate --reset --network=development 
```


## Run app in ionic

```shell
npm run start:ionic:ganache
```

then browse to localhost:8100 or localhost:8200.

## Run app on ios

https://ionicframework.com/docs/building/ios

```shell
ng build --prod
ionic capacitor copy ios
ionic capacitor open ios
```
