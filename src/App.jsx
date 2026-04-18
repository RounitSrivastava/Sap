import React, { useEffect, useMemo, useState } from "react";

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
  };

  const createOrder = () => {
    const customer = customers.find(
      (c) => c.id === Number(selectedCustomer)
    );
    const product = products.find(
      (p) => p.id === Number(selectedProduct)
    );

    if (!customer || !product) return;

    const total = Number(qty) * product.price;

    const newOrder = {
      id: Date.now(),
      orderNo: "SO-" + Date.now().toString().slice(-6),
      customer: customer.name,
      email: customer.email,
      product: product.name,
      qty: Number(qty),
      price: product.price,
      total,
      status: "Sales Order Created",
      paid: false,
      createdAt: new Date().toLocaleString(),
    };

    setOrders([newOrder, ...orders]);
    setQty(1);
  };

  const updateStatus = (id, status) => {
    setOrders(
      orders.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );
  };

  const markPaid = (id) => {
    setOrders(
      orders.map((item) =>
        item.id === id ? { ...item, paid: true, status: "Completed" } : item
      )
    );
  };

  const deleteOrder = (id) => {
    setOrders(orders.filter((item) => item.id !== id));
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(
      (o) =>
        o.customer.toLowerCase().includes(search.toLowerCase()) ||
        o.product.toLowerCase().includes(search.toLowerCase()) ||
        o.orderNo.toLowerCase().includes(search.toLowerCase())
    );
  }, [orders, search]);

  const revenue = orders.reduce((a, b) => a + b.total, 0);
  const paidOrders = orders.filter((o) => o.paid).length;
  const pendingOrders = orders.filter((o) => !o.paid).length;

  const card = {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "20px",
    padding: "20px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
  };

  const input = {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.07)",
    color: "#fff",
    outline: "none",
    marginBottom: "12px",
  };

  const btn = (bg) => ({
    padding: "10px 14px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    color: "#fff",
    fontWeight: "600",
    background: bg,
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "30px",
        color: "#fff",
        fontFamily: "Arial",
        background:
          "linear-gradient(135deg,#020617,#0f172a,#312e81,#1e1b4b,#020617)",
      }}
    >
      <h1 style={{ textAlign: "center", fontSize: "38px", marginBottom: "25px" }}>
        Order-to-Cash (O2C) Management System
      </h1>

      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "18px",
          marginBottom: "25px",
        }}
      >
        <div style={card}>
          <h3>Total Orders</h3>
          <h2>{orders.length}</h2>
        </div>

        <div style={card}>
          <h3>Total Revenue</h3>
          <h2>₹{revenue}</h2>
        </div>

        <div style={card}>
          <h3>Paid Orders</h3>
          <h2>{paidOrders}</h2>
        </div>

        <div style={card}>
          <h3>Pending Payments</h3>
          <h2>{pendingOrders}</h2>
        </div>
      </div>

      {/* Forms */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
          gap: "20px",
        }}
      >
        <div style={card}>
          <h2>Add Customer</h2>
          <input
            style={input}
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          <input
            style={input}
            placeholder="Email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
          />
          <button
            style={btn("linear-gradient(135deg,#7c3aed,#2563eb)")}
            onClick={addCustomer}
          >
            Add Customer
          </button>
        </div>

        <div style={card}>
          <h2>Add Product</h2>
          <input
            style={input}
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <input
            style={input}
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <button
            style={btn("linear-gradient(135deg,#16a34a,#22c55e)")}
            onClick={addProduct}
          >
            Add Product
          </button>
        </div>

        <div style={card}>
          <h2>Create Sales Order</h2>

          <select
            style={input}
            onChange={(e) => setSelectedCustomer(e.target.value)}
          >
            <option value="">Select Customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            style={input}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <input
            style={input}
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
          />

          <button
            style={btn("linear-gradient(135deg,#f59e0b,#ef4444)")}
            onClick={createOrder}
          >
            Create Order
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ ...card, marginTop: "25px" }}>
        <input
          style={input}
          placeholder="Search by Order No / Customer / Product"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Orders */}
      <div style={{ ...card, marginTop: "25px" }}>
        <h2>Sales Orders / Delivery / Billing / Payment</h2>

        {filteredOrders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              style={{
                marginTop: "15px",
                padding: "18px",
                borderRadius: "16px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <h3>{order.orderNo}</h3>
              <p>Customer: {order.customer}</p>
              <p>Product: {order.product}</p>
              <p>Qty: {order.qty}</p>
              <p>Unit Price: ₹{order.price}</p>
              <p>Total: ₹{order.total}</p>
              <p>Status: {order.status}</p>
              <p>Payment: {order.paid ? "Paid ✅" : "Pending ⏳"}</p>
              <p>Date: {order.createdAt}</p>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  marginTop: "12px",
                }}
              >
                <button
                  style={btn("linear-gradient(135deg,#2563eb,#06b6d4)")}
                  onClick={() =>
                    updateStatus(order.id, "Delivery Created")
                  }
                >
                  Delivery
                </button>

                <button
                  style={btn("linear-gradient(135deg,#16a34a,#22c55e)")}
                  onClick={() =>
                    updateStatus(order.id, "Invoice Generated")
                  }
                >
                  Invoice
                </button>

                <button
                  style={btn("linear-gradient(135deg,#7c3aed,#ec4899)")}
                  onClick={() => markPaid(order.id)}
                >
                  Receive Payment
                </button>

                <button
                  style={btn("linear-gradient(135deg,#ef4444,#dc2626)")}
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