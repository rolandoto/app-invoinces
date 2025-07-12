import { useState } from 'react'
import { Trash2, Plus, Download, Building, User, DollarSign } from "lucide-react"
import html2canvas from "html2canvas";
import jsPDF from "jspdf"; 
import './App.css'
function App() {
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState('')
  const [userNameCompany, setUserNameCompany] = useState('')
  const [documentCompany, setDocumentCompany] = useState("")
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('error')




const styles = {
  fontSize: 10,
  fontFamily: "arial",
  textAlign: "center",
  padding: "50px",
};

const btnStyle = {
  cursor: "pointer",
  padding: "10px 20px",
  borderRadius: "5px",
  outline: "none",
  fontSize: "10px",
};

// Estilo para el título
const titleStyle = {
  fontSize: 20,
  fontStyle: 'normal',
  textColor: 'Black',
};


  const totalReduce = items.reduce((sum, current) => {
    return sum + current.price * current.quantity
  }, 0)

  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  const currentDate = new Date().toLocaleDateString('es-ES', options)

  const showToastMessage = (message, type = 'error') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const requiredValidator = (value) => {
    return !(value === '' || value === null || value === undefined)
  }


     const print = () => {
       if (items.length === 0) {
          showToastMessage('Por favor agrega al menos un producto')
        } else if (!userNameCompany || !documentCompany) {
          showToastMessage('Por favor completa los datos de la empresa')
        } else {
          const input = document.getElementById("printThis");
          const pdf = new jsPDF({
            format: [500, 1100] // Custom size: width = 500, height = 1100 (in units, default is mm)
          });

          pdf.setFont('arial');
          html2canvas(input, {scale:0.1}).then((canvas) => {
            
            const pdf = new jsPDF({
              orientation: "landscape",
            
              format: [800, 800]
          });
          
          pdf.setFont('arial');
          // Título
          pdf.setFontStyle(titleStyle.fontStyle);
          pdf.setFontStyle(btnStyle.fontSize);
          pdf.text(100, 20, `Medellín, ${currentDate}`);
          pdf.setFontStyle(btnStyle.fontSize);
          pdf.text(120, 35, userNameCompany);
          pdf.text(110, 50, `CC: ${documentCompany}`);
          pdf.text(100, 80, `DEBE A:`);
          pdf.text(100, 89, `LEWIS BOSCAN`);
          pdf.text(100, 98, `CC: 1017277279`);

          pdf.text(30, 142, `Concepto`);
          pdf.text(200, 142, `Valor unitario`);
          
          let count  =40
          items.map((item, index) => {
          const total =  parseInt(150 + parseInt(index *8))
          count =total
            pdf.text(30, total,`${item.quantity} ${item.name}`)
            pdf.text(200, total,`${parseInt(item.price).toLocaleString()}`)
          })


          const total = count +30
          const totalFooter = total+10

          pdf.text(30, total, `Valor total  $${parseInt(totalReduce).toLocaleString()}`);
          pdf.text(30, totalFooter, `Favor consignar a mi cuenta de ahorros Bancolombia 91200559741`);
            showToastMessage('PDF generado exitosamente', 'success')
          pdf.save("download.pdf"); // Guarda el PDF
          });
        
        
         
        }
    };


  const handleAddToCart = () => {
    if (requiredValidator(name) && requiredValidator(price) && requiredValidator(quantity)) {
      const cleanedPrice = price.replace(/\./g, '')
      const newItem = {
        id: Date.now() + Math.random(),
        name: name,
        price: parseInt(cleanedPrice),
        quantity: parseInt(quantity),
      }

      setItems([...items, newItem])
      setName('')
      setPrice('')
      setQuantity('')
      showToastMessage('Producto agregado correctamente', 'success')
    } else {
      showToastMessage('Por favor completa todos los campos')
    }
  }

  const numberWithCommas = (value) => {
    if (!value) return ''
    const intValue = parseInt(value.replace(/[^\d]/g, ''), 10)
    return intValue.toLocaleString('es-CO')
  }

  const eliminarProducto = (productoAEliminar) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productoAEliminar))
    showToastMessage('Producto eliminado', 'success')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
          toastType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toastMessage}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Building className="text-blue-600" />
              Generador de Cuentas de Cobro
            </h1>
            <div className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
              Medellín, {currentDate}
            </div>
          </div>
          
          {/* Company Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="inline mr-1" />
                Nombre de la empresa
              </label>
              <input
                type="text"
                value={userNameCompany}
                onChange={(e) => setUserNameCompany(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Ingresa el nombre de la empresa"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline mr-1" />
                NIT o Documento
              </label>
              <input
                type="text"
                value={documentCompany}
                onChange={(e) => setDocumentCompany(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Ingresa el NIT o documento"
              />
            </div>
          </div>
        </div>

        {/* Add Product Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Plus className="text-green-600" />
            Agregar Producto/Servicio
          </h2>
          
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Describe el producto o servicio"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="inline mr-1" />
                Precio Unitario
              </label>
              <input
                type="text"
                value={price !== '' ? numberWithCommas(price) : ''}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="1"
                min="1"
              />
            </div>
          </div>
          
          <button
            onClick={handleAddToCart}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center gap-2">
            <Plus />
            Agregar al Carrito
          </button>
        </div>

        {/* Items List */}
        {items.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Productos/Servicios ({items.length})
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Descripción</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Precio</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Cantidad</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Total</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-gray-800">{item.name}</td>
                      <td className="py-3 px-4 text-right text-gray-800">
                        ${item.price.toLocaleString('es-CO')}
                      </td>
                      <td className="py-3 px-4 text-center text-gray-800">{item.quantity}</td>
                      <td className="py-3 px-4 text-right font-medium text-gray-800">
                        ${(item.price * item.quantity).toLocaleString('es-CO')}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => eliminarProducto(item.id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1"
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
              <div className="text-lg font-medium text-gray-700">
                Total General:
              </div>
              <div className="text-2xl font-bold text-blue-600">
                ${totalReduce.toLocaleString('es-CO')}
              </div>
            </div>
          </div>
        )}

        {/* Generate PDF Button */}
          <div className="bg-white rounded-lg shadow-lg p-6">
          <button
            onClick={print}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 text-lg"
          >
            <Download />
            Descargar PDF
          </button>
        </div>

        {/* Footer */}
         <div id="printThis">
                  
                  </div>
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 Generador de Cuentas de Cobro</p>
          <p className="mt-1">Edilberto José Boscán Alcántara - CC: 1017277279</p>
        </div>
      </div>
    </div>
  )
}

export default App