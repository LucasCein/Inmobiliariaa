import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";

const useFirestoneCollection = (collectionName, filters = []) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const dbFirestore = getFirestore();
      const queryCollection = collection(dbFirestore, collectionName);

      let queryCollectionFiltered = queryCollection;

      for (const filter of filters) {
        const [field, operator, value] = filter;
        queryCollectionFiltered = query(
          queryCollectionFiltered,
          where(field, operator, value)
        );
      }

      try {
        const res = await getDocs(queryCollectionFiltered);
        const data = res.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [collectionName, filters]);

  return { data, isLoading };
};

export default useFirestoneCollection;
