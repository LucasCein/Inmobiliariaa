import React from 'react'
import { Link } from 'react-router-dom';

const Ventas = () => {
  return (
    <div>
            <div className=' my-3 d-flex justify-content-end'>
            <Link to={"/ABMVentas"}>
              <button className='btn btn-success'>Add New</button>
            </Link>
          </div>
    </div>
  )
}

export default Ventas