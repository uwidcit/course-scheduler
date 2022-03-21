// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase :{
    apiKey: "AIzaSyAUSEWMqWLzoXRME2YHmvj1H8nTErrJgFI",
    authDomain: "scheduler-authentication.firebaseapp.com",
    databaseURL: "https://scheduler-authentication-default-rtdb.firebaseio.com",
    projectId: "scheduler-authentication",
    storageBucket: "scheduler-authentication.appspot.com",
    messagingSenderId: "89521061793",
    appId: "1:89521061793:web:9f5930ed00a5bb1a4655e0"
  },
  backendURL : "node-email-server1.herokuapp.com"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
