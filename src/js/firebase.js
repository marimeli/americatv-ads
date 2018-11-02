// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyDsfk0M5QKKKUYOJ4mqAzK_KB6ICwCXWeA",
  authDomain: "americatv-ads.firebaseapp.com",
  databaseURL: "https://americatv-ads.firebaseio.com",
  projectId: "americatv-ads",
  storageBucket: "americatv-ads.appspot.com",
  messagingSenderId: "507467215527"
});

const auth = firebase.auth();
const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });

//función registro
const signUp = (email, password) => auth.createUserWithEmailAndPassword(email, password);

// función inicio de sesión
const signIn = (email, password) => auth.signInWithEmailAndPassword(email, password);

const saveUser = (user) => db.doc(`users/${user.uid}`).set(user);

const getBrands = () => db.collection('products').get()
  .then(snapshot => {
    const brands = [];
    snapshot.forEach(doc => brands.push(doc.data()));
    return brands;
  });

const getShowInfo = id => db.doc(`shows/${id}`).get().then(doc => doc.data());

const updateShowInfo = (id, currentDay, currentInterval) => db.doc(`shows/${id}`).get().then(doc => doc.data())
  .then(({schedule}) => db.doc(`shows/${id}`).update({
    schedule: schedule.map((scheduleElem) => {
      if (scheduleElem.day === currentDay) {
        scheduleElem.intervals.map((intervalElem) => {
          if (intervalElem.interval === currentInterval) {
            intervalElem.status = 'unavailable';
          }
          return intervalElem;
        })
      }
      return scheduleElem;
    })
  }))

const signOut = () => auth.signOut().then(() => window.location = './login.html');

const saveReservation = reservation => db.collection('reservations').add(reservation);
