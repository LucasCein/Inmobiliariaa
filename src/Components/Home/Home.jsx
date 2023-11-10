
import { useEffect, useState } from 'react';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill, BsHouseFill, BsCurrencyDollar }
  from 'react-icons/bs'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line }
  from 'recharts';
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
const Home = () => {

  const data = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];
  const [propiedades, setPropiedades] = useState([]);
  const [propiedadesVenta, setPropiedadesVenta] = useState([]);
  const [propiedadesAlquiler, setPropiedadesAlquiler] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [gastoPorMes, setGastoPorMes] = useState([]);
  const [ingresosPorMes, setIngresosPorMes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [resumenPorMes, setResumenPorMes] = useState([]);

  useEffect(() => {
    const dbFirestore = getFirestore();
    const queryCollection = collection(dbFirestore, "propiedades");
    const queryCollectPagos = collection(dbFirestore, "pagoFacturas");
    const queryClientes = collection(dbFirestore, "clientes");
    const queryIngresos = collection(dbFirestore, "venta");
    
    const queryCollectionFiltered = query(
      queryCollection,
      where("visible", "==", true)
    );
    const queryCollectionVenta = query(
      queryCollection,
      where("tipo", "==", 'venta'),
      where("visible", "==", true)
    );
    const queryCollectionAlquiler = query(
      queryCollection,
      where("tipo", "==", 'alquiler'),
      where("visible", "==", true)
    );

    const queryCollectionPagos = query(
      queryCollectPagos,
      where("visible", "==", true)
    );
    const queryCollectionClientes = query(
      queryClientes,
      where("Activo", "==", true)
    );
   
    getDocs(queryCollectionFiltered)
      .then((res) =>
        setPropiedades(
          res.docs.map((propiedades) => ({
            id: propiedades.id,
            ...propiedades.data(),
          }))
        )
      )
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));

    getDocs(queryCollectionVenta)
      .then((res) =>
        setPropiedadesVenta(
          res.docs.map((propiedades) => ({
            id: propiedades.id,
            ...propiedades.data(),
          }))
        )
      )
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));

    getDocs(queryCollectionAlquiler)
      .then((res) =>
        setPropiedadesAlquiler(
          res.docs.map((propiedades) => ({
            id: propiedades.id,
            ...propiedades.data(),
          }))
        )
      )
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));

    getDocs(queryCollectionPagos)
      .then((res) => {
        const pagos = res.docs.map(factura => ({
          id: factura.id,
          ...factura.data(),
        }));
        console.log(pagos)
        // Paso 2: Crear la estructura para guardar las sumas por mes
        let sumasPorMes = {};

        // Paso 3: Procesar los datos y sumar por mes
        pagos.forEach(pago => {
          const [year, month, day] = pago.fecha.split("-").map(Number);
          // const fecha = new Date(year, month - 1, day);  
          const key = `${year}-${month < 10 ? '0' + month : month}`;
          sumasPorMes[key] = (sumasPorMes[key] || 0) + parseInt(pago.monto, 10);
        });

        const arrayResultante = Object.entries(sumasPorMes).map(([name, monto]) => ({
          name,
          monto
        }));
        arrayResultante.sort((a, b) => {
          const dateA = new Date(a.name);
          const dateB = new Date(b.name);

          if (dateA < dateB) {
            return -1;
          }
          if (dateA > dateB) {
            return 1;
          }
          return 0;
        });

        setGastoPorMes(arrayResultante)
      })
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
    getDocs(queryCollectionClientes)
      .then((res) =>
        setClientes(
          res.docs.map((clientes) => ({
            id: clientes.id,
            ...clientes.data(),
          }))
        )
      )
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));


    getDocs(queryIngresos)
      .then((res) => {
        const ingresos = res.docs.map(venta => ({
          id: venta.id,
          ...venta.data(),
        }));
        console.log(ingresos)
        // Paso 2: Crear la estructura para guardar las sumas por mes
        let sumasPorMes = {};

        // Paso 3: Procesar los datos y sumar por mes
        ingresos.forEach(ingreso => {
          const [year, month, day] = ingreso.fecha.split("-").map(Number);
          // const fecha = new Date(year, month - 1, day);  
          const key = `${year}-${month < 10 ? '0' + month : month}`;
          sumasPorMes[key] = (sumasPorMes[key] || 0) + parseInt(ingreso.precio, 10);
        });

        const arrayResultante = Object.entries(sumasPorMes).map(([name, precio]) => ({
          name,
          precio
        }));
        arrayResultante.sort((a, b) => {
          const dateA = new Date(a.name);
          const dateB = new Date(b.name);

          if (dateA < dateB) {
            return -1;
          }
          if (dateA > dateB) {
            return 1;
          }
          return 0;
        });

        setIngresosPorMes(arrayResultante)
      })
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
    //me gustaria juntar los estados gastosPorMes e IngresosPorMes en un solo estado con la forma [{name: '2023-01', gasto:1000, ingreso: 1000}]
    // Asume que ya tienes gastoPorMes e ingresosPorMes definidos y llenos de datos
    
  }, []);
  console.log(propiedades.length)
  console.log(resumenPorMes)
  useEffect(() => {
    // Este useEffect se ejecutará cada vez que gastoPorMes o ingresosPorMes cambien.
    const combinarEstados = () => {
      let combinedData = {};
  
      gastoPorMes.forEach(gasto => {
        const { name, monto } = gasto;
        combinedData[name] = {
          ...combinedData[name],
          name,
          gasto: monto
        };
      });
  
      ingresosPorMes.forEach(ingreso => {
        const { name, precio } = ingreso;
        combinedData[name] = {
          ...combinedData[name],
          name,
          ingreso: precio
        };
      });
  
      let finalArray = Object.values(combinedData).map(item => ({
        name: item.name,
        gasto: item.gasto || 0,
        ingreso: item.ingreso || 0
      }));
  
      setResumenPorMes(finalArray);
    };
  
    if (gastoPorMes.length > 0 && ingresosPorMes.length > 0) {
      combinarEstados();
    }
  }, [gastoPorMes, ingresosPorMes]);
  
  return (
    <main className='main-container'>
      <div >
        <h1 className='text-center mb-5'>DASHBOARD</h1>
      </div>

      <div className='main-cards'>
        <div className='card'>
          <div className='card-inner'>
            <h3>Propiedades</h3>
            <BsHouseFill className='card_icon' />
          </div>
          <h1>{propiedades.length}</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>VENTA</h3>
            <BsCurrencyDollar className='card_icon' />
          </div>
          <h1>{propiedadesVenta.length}</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>ALQUILER</h3>
            <BsCurrencyDollar className='card_icon' />
          </div>
          <h1>{propiedadesAlquiler.length}</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>CLIENTES</h3>
            <BsPeopleFill className='card_icon' />
          </div>
          <h1>{clientes.length}</h1>
        </div>
      </div>

      <div className='charts'>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={resumenPorMes}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="gasto" name="Gastos por mes" fill="#8884d8" />
            <Bar dataKey="ingreso" name="Ingresos por mes" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={resumenPorMes}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="gasto" name='Gastos' stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="ingreso" name="Ingresos" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>

      </div>
    </main>
  )
}

export default Home