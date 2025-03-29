import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import HeaderParcelBorr from '../components/HeaderParcelBorr'
import '../css/ParcelasDelete.css'

// Definición de la interfaz para los datos de las parcelas
interface Parcela {
  id: number
  nombre: string
  ubicacion: string
  responsable: string
  tipo_cultivo: string
  fecha_eliminado: string
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

function ParcelasDelete() {
  const [parcelas, setParcelas] = useState<Parcela[]>([]) // Estado para almacenar los datos
  const [loading, setLoading] = useState(true) // Estado para manejar el loading
  const [error, setError] = useState<string | null>(null) // Estado para manejar errores

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Sincronizar los datos
        const syncResponse = await fetch('http://localhost:8080/sync', { method: 'GET' })
        if (!syncResponse.ok) {
          throw new Error(`Error ${syncResponse.status}: No se pudo sincronizar los datos.`)
        }
  
        // Consumir la API de parcelas borradas
        const response = await fetch('http://localhost:8080/parcelas-borradas')
        if (!response.ok) {
          throw new Error('Error al obtener los datos')
        }
        const data: Parcela[] = await response.json()
  
        // Filtrar datos duplicados basados en el ID
        const uniqueData = Array.from(new Map(data.map(parcela => [parcela.id, parcela])).values())
  
        setParcelas(uniqueData)
        setLoading(false)
      } catch (err: any) {
        setError(err.message)
        setLoading(false)
      }
    }
  
    fetchData()
  }, [])

  return (
    <>
           <div className='parcelasdelete'>
        <HeaderParcelBorr></HeaderParcelBorr>
        <Sidebar />
      </div>
      <div className='contenido1'>
        <div className='table-div'>
          {loading ? (
            <p className='loading-delete'>Cargando datos...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : parcelas.length === 0 ? (
            <p>No hay parcelas borradas.</p>
          ) : (
            <table className='table-modern'>
              <thead>
                <tr>
                  <th>Nombre de <br></br> proyecto</th>
                  <th>Ubicacion</th>
                  <th>Responsable</th>
                  <th>Tipo de cultivo</th>
                  <th>Fecha <br></br>de eliminacion</th>
                </tr>
              </thead>
              <tbody>
                {parcelas.map((parcela) => (
                  <tr key={parcela.id}>
                    <td>{parcela.nombre}</td>
                    <td>{parcela.ubicacion}</td>
                    <td>{parcela.responsable}</td>
                    <td>{parcela.tipo_cultivo}</td>
                    <td>{formatDate(parcela.fecha_eliminado)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
}

export default ParcelasDelete