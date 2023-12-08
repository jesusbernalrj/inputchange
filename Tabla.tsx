import {  Trash } from "lucide-react"
import { usePosContext } from "../../hooks/usePosContext"
import Descuentos from "../Descuentos/Descuento"
import { useEffect, useState } from "react"
import { CartItem, ProductosPropsApi } from "../../interface/interface"
import { ProductosPropsModel } from "../../models/productos/productos.model"
import { SelectState } from "../HomePage/HomePage"
interface Table {
  id:string
  index: number
  toggleSelectProduct: (id: string) => void
  selectProduct: SelectState
  combinedProducts:  ProductosPropsModel[]
  setSelectProduct: React.Dispatch<React.SetStateAction<SelectState>>
  name:string
  precio:number
  productos: CartItem
}

const Tabla = ({  id, precio, name, productos, index, toggleSelectProduct, selectProduct, combinedProducts, setSelectProduct}: Table) => {
  const {
    cartItems,
    setCartItems,
    crearNewProducto,
    setCrearNewProducto,
    indice,
    totalDescuentoSum,
    setModalOpen,
  } = usePosContext();
 
  const currentCartItems = cartItems && cartItems[indice];
  const findQuantityProduct = crearNewProducto?.find((item) => item.producto_identificador === id);
  const quantityCartItems = cartItems && cartItems[indice];
 
 
 
  const getItemQuantity = (producto_identificador: string) => {
    return quantityCartItems?.find((item) => item.id === producto_identificador)?.quantity || 0;
  };
  const getValue = getItemQuantity(id);
  const [inputValue, setInputValue] = useState(getValue);
  const decrementCarrito = (producto_identificador: string) => {
    const findProduct = quantityCartItems?.find((item) => item.id === producto_identificador);
    if (findProduct && findProduct.quantity > 1) {
      setCartItems((prevCartItems) => ({
        ...prevCartItems,
        [indice]: prevCartItems[indice].map((item) =>
          item.id === producto_identificador ? { ...item, quantity: findProduct.quantity - 1 } : item
        ),
      }));
      setCrearNewProducto((item) => {
        return item.map((pro) =>
          pro.producto_identificador === producto_identificador
            ? { ...pro, quantity: (Number(findQuantityProduct?.producto_existencia) + 1).toString() }
            : pro
        );
      });
    } else {
      setCartItems((prevCartItems) => ({
        ...prevCartItems,
        [indice]: prevCartItems[indice]?.filter((item) => item.id !== producto_identificador),
      }));
      setSelectProduct((prev) => ({...prev, [producto_identificador]: false}))
      setCrearNewProducto((item) => {
        return item.map((pro) =>
          pro.producto_identificador === producto_identificador
            ? { ...pro, quantity: (Number(findQuantityProduct?.producto_existencia) + 1)?.toString() }
            : pro
        );
      });
    }
  };

  const longitudName = (name: string | undefined) => {
    const MaxName = 7;
    if (name) {
      if (name.length >= MaxName + 1) {
        return name.slice(0, MaxName) + '...';
      }
      return name;
    }
  };

  const addtoCarrito = (producto_identificador: string) => {
    const findCartItems = currentCartItems?.find((item) => item.id === producto_identificador);
    if (findCartItems) {
      // Si ya existe en el carrito, incrementar la cantidad
      setCartItems((cart) => ({
        ...cart,
        [indice]: cart[indice]?.map((item) =>
          item.id === producto_identificador ? { ...item, quantity: findCartItems.quantity + 1 } : item
        ),
      }));
    } 
    setCrearNewProducto((item) =>
      item.map((pro) =>
        pro.producto_identificador === producto_identificador
          ? { ...pro, quantity: (Number(findQuantityProduct?.producto_existencia) - 1)?.toString() }
          : pro
      )
    );
  };
 const deleteCarrito = (producto_identificador: string) => {
 setCartItems((prevCartItems) => ({
    ...prevCartItems,
    [indice]: prevCartItems[indice]?.filter((item) => item.id !== producto_identificador),
  }));
  setSelectProduct((prev) => ({...prev, [producto_identificador]: false}))
 }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue)) {
      setInputValue(newValue);
  
      setCartItems((prevCartItems) => ({
        ...prevCartItems,
        [indice]: prevCartItems[indice].map((item) =>
          item.id === id ? { ...item, quantity: newValue } : item
        ),
      }));
    }
    if (newValue === 0) {
      setInputValue(1);
    }
  };
  useEffect(() => {
    if(inputValue === 0){
      setInputValue(1)
    }
  }, [inputValue])
  
  useEffect(() => {
    setInputValue(getValue);
  }, [getValue]);

  return (
    <div onClick={() => toggleSelectProduct(id)}  className={selectProduct[id] ? 'bg-light table-row ' : 'table-row'} >

 <div  className=" p-0 d-flex gap-2 mt-1 table-cell" >
 <button className="button-tabla " onClick={(event) => { event.stopPropagation(); decrementCarrito(id); }}>
          -
        </button>
        <input onChange={handleInputChange} value={inputValue} className="inputQuantity" /> 

        <button className="button-tabla" onClick={(event) => { event.stopPropagation(); addtoCarrito(id); }}>
          +
        </button>
        
      </div>
      <div>
        {longitudName(name)}
      </div>
      <div  className="table-cell" >
        {precio?.toFixed(1) }
      </div>
      <div  className="table-cell" >
        {totalDescuentoSum[id]?.toFixed(1)}
      </div>
      <div  className="table-cell" >
        <button type="button" className="btn p-0" onClick={(event) => { event.stopPropagation(); deleteCarrito(id); }}>
          <Trash className="icons" />
        </button>
        { <Descuentos id={id} productos={productos} combinedProducts={combinedProducts} quantity={inputValue} indexItem={index} setModalOpen={setModalOpen} />}
      </div>
     
    </div>
  );
};

export default Tabla;
