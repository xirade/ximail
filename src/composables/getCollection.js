import { ref } from "@vue/reactivity";
import { watchEffect } from "@vue/runtime-core";
import { projectFirestore } from "../firebase/config";

const getCollection = (collection, query) => {
  const documents = ref(null);
  const error = ref(null);

  // register the firestore collection reference
  let collectionRef = projectFirestore.collection(collection).orderBy("sentAt");
  // check if getCollection have query of User
  if (query) {
    collectionRef = collectionRef.where(...query);
  }

  const unsub = collectionRef.onSnapshot(
    snap => {
      let results = [];
      snap.docs.forEach(doc => {
        doc.data().sentAt && results.push({ ...doc.data(), id: doc.id });
      });
      // update values
      documents.value = results;
      error.value = null;
    },
    err => {
      console.log(err.message);
      documents.value = null;
      error.value = "could not fetch data";
    }
  );

  watchEffect(onInvalidate => {
    onInvalidate(() => unsub());
  });

  return { documents, error };
};

export default getCollection;
