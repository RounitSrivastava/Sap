import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

export default function App() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [qty, setQty] = useState(1);
  const [search, setSearch] = useState("");

  const [popup, setPopup] = useState("");

  useEffect(() => {
    setCustomers(JSON.parse(localStorage.getItem("o2c_customers")) || []);
    setProducts(JSON.parse(localStorage.getItem("o2c_products")) || []);
    setOrders(JSON.parse(localStorage.getItem("o2c_orders")) || []);
  }, []);

  useEffect(() => {
    localStorage.setItem("o2c_customers", JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem("o2c_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("o2c_orders", JSON.stringify(orders));
  }, [orders]);

  const showPopup = (msg) => {
    setPopup(msg);
    setTimeout(() => setPopup(""), 2500);
  };

  const addCustomer = () => {
    if (!customerName.trim()) return;

    const newCustomer = {
      id: Date.now(),
      name: customerName,
      email: customerEmail,
    };

    setCustomers([newCustomer, ...customers]);
    setCustomerName("");
    setCustomerEmail("");
    showPopup("✅ Customer Added Successfully");
  };

  const addProduct = () => {
    if (!productName.trim() || !price) return;

    const newProduct = {
      id: Date.now(),
      name: productName,
      price: Number(price),
    };

    setProducts([newProduct, ...products]);
    setProductName("");
    setPrice("");
    showPopup("✅ Product Added Successfully");
  };

  const createOrder = () => {
    const customer = customers.find(
      (c) => c.id === Number(selectedCustomer)
    );

    const product = products.find(
      (p) => p.id === Number(selectedProduct)
    );

    if (!customer || !product) return;

    const newOrder = {
      id: Date.now(),
      orderNo: "SO-" + Date.now().toString().slice(-6),
      customer: customer.name,
      product: product.name,
      qty: Number(qty),
      price: product.price,
      total: Number(qty) * product.price,
      status: "Sales Order Created",
      paid: false,
      createdAt: new Date().toLocaleString(),
    };

    setOrders([newOrder, ...orders]);
    setQty(1);
    showPopup("🎉 Order Created Successfully");
  };

  const updateStatus = (id, status) => {
    setOrders(
      orders.map((order) =>
        order.id === id ? { ...order, status } : order
      )
    );
    showPopup("📦 Status Updated");
  };

  const markPaid = (id) => {
    setOrders(
      orders.map((order) =>
        order.id === id
          ? { ...order, paid: true, status: "Completed" }
          : order
      )
    );
    showPopup("💰 Payment Received");
  };

  const deleteOrder = (id) => {
    setOrders(orders.filter((order) => order.id !== id));
    showPopup("🗑️ Order Deleted");
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(
      (order) =>
        order.customer.toLowerCase().includes(search.toLowerCase()) ||
        order.product.toLowerCase().includes(search.toLowerCase()) ||
        order.orderNo.toLowerCase().includes(search.toLowerCase())
    );
  }, [orders, search]);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const paidOrders = orders.filter((o) => o.paid).length;
  const pendingOrders = orders.filter((o) => !o.paid).length;

  return (
    <div className="app">
      {popup && <div className="popup">{popup}</div>}

      <h1 className="title">Order-to-Cash (O2C) Management System</h1>

      {/* KPI Cards */}
      <div className="grid kpi-grid">
        <div className="card">
          <h3>Total Orders</h3>
          <h2>{orders.length}</h2>
        </div>

        <div className="card">
          <h3>Total Revenue</h3>
          <h2>₹{totalRevenue}</h2>
        </div>

        <div className="card">
          <h3>Paid Orders</h3>
          <h2>{paidOrders}</h2>
        </div>

        <div className="card">
          <h3>Pending Payments</h3>
          <h2>{pendingOrders}</h2>
        </div>
      </div>

      {/* Forms */}
      <div className="grid form-grid">
        <div className="card">
          <h2>Add Customer</h2>

          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
          />

          <button className="purple" onClick={addCustomer}>
            Add Customer
          </button>
        </div>

        <div className="card">
          <h2>Add Product</h2>

          <input
            type="text"
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <button className="green" onClick={addProduct}>
            Add Product
          </button>
        </div>

        <div className="card">
          <h2>Create Sales Order</h2>

          <select
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
          >
            <option value="">Select Customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>

          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="">Select Product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
          />

          <button className="orange" onClick={createOrder}>
            Create Order
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="card search-box">
        <input
          type="text"
          placeholder="Search by Order No / Customer / Product"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Orders */}
      <div className="card orders-box">
        <h2>Sales Orders / Delivery / Billing / Payment</h2>

        {filteredOrders.length === 0 ? (
          <p>No Orders Found</p>
        ) : (
          filteredOrders.map((order) => (
            <div className="order-item" key={order.id}>
              <h3>{order.orderNo}</h3>
              <p>Customer: {order.customer}</p>
              <p>Product: {order.product}</p>
              <p>Qty: {order.qty}</p>
              <p>Total: ₹{order.total}</p>
              <p>Status: {order.status}</p>
              <p>Payment: {order.paid ? "Paid ✅" : "Pending ⏳"}</p>
              <p>Date: {order.createdAt}</p>

              <div className="btn-group">
                <button
                  className="blue"
                  onClick={() =>
                    updateStatus(order.id, "Delivery Created")
                  }
                >
                  Delivery
                </button>

                <button
                  className="green"
                  onClick={() =>
                    updateStatus(order.id, "Invoice Generated")
                  }
                >
                  Invoice
                </button>

                <button
                  className="pink"
                  onClick={() => markPaid(order.id)}
                >
                  Payment
                </button>

                <button
                  className="red"
                  onClick={() => deleteOrder(order.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}