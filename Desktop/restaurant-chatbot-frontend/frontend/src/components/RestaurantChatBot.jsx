import React, { useState, useEffect, useRef } from 'react';

// Menu items data
const menuItems = [
  { id: 1, name: "Jollof Rice with Chicken", price: 2500, category: "Main" },
  { id: 2, name: "Fried Rice with Beef", price: 2800, category: "Main" },
  { id: 3, name: "Pounded Yam with Egusi Soup", price: 2200, category: "Main" },
  { id: 4, name: "Beef Burger with Fries", price: 1800, category: "Fast Food" },
  { id: 5, name: "Chicken Shawarma", price: 1500, category: "Fast Food" },
  { id: 6, name: "Pepperoni Pizza", price: 3200, category: "Fast Food" },
  { id: 7, name: "Chicken Salad", price: 1200, category: "Appetizer" },
  { id: 8, name: "Chapman Cocktail", price: 800, category: "Drink" },
  { id: 9, name: "Vanilla Ice Cream", price: 700, category: "Dessert" }
];

const RestaurantChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [currentOrder, setCurrentOrder] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  // Initialize session
  useEffect(() => {
    let id = localStorage.getItem('sessionId');
    if (!id) {
      id = 'session_' + Date.now();
      localStorage.setItem('sessionId', id);
    }
    setSessionId(id);

    // Load saved data
    const savedOrder = localStorage.getItem(`${id}_currentOrder`);
    const savedHistory = localStorage.getItem(`${id}_orderHistory`);

    if (savedOrder) setCurrentOrder(JSON.parse(savedOrder));
    if (savedHistory) setOrderHistory(JSON.parse(savedHistory));

    // Add welcome message
    setTimeout(() => {
      addBotMessage("Welcome to FoodExpress! How can I help you today?");
      showOptions();
    }, 800);
  }, []);

  // Scroll to bottom of chat
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addUserMessage = (message) => {
    setMessages(prev => [...prev, { type: 'user', content: message }]);
  };

  const addBotMessage = (message) => {
    setMessages(prev => [...prev, { type: 'bot', content: message }]);
  };

  const showTypingIndicator = () => {
    setMessages(prev => [...prev, { type: 'typing', content: '' }]);
  };

  const removeTypingIndicator = () => {
    setMessages(prev => prev.filter(msg => msg.type !== 'typing'));
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      addUserMessage(inputValue);
      const message = inputValue;
      setInputValue('');
      
      showTypingIndicator();
      
      setTimeout(() => {
        removeTypingIndicator();
        processUserInput(message);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const showOptions = () => {
    setMessages(prev => [...prev, { 
      type: 'options', 
      content: '',
      options: [
        { value: '1', label: 'Place an order' },
        { value: '99', label: 'Checkout order' },
        { value: '98', label: 'Order history' },
        { value: '97', label: 'Current order' },
        { value: '0', label: 'Cancel order' }
      ]
    }]);
  };

  const showMenu = () => {
    let menuMessage = "Here's our menu:<br><br>";
    
    // Group menu items by category
    const categories = {};
    menuItems.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = [];
      }
      categories[item.category].push(item);
    });
    
    // Display menu by category
    for (const category in categories) {
      menuMessage += `<strong>${category}:</strong><br>`;
      categories[category].forEach(item => {
        menuMessage += `${item.id}. ${item.name} - ₦${item.price}<br>`;
      });
      menuMessage += "<br>";
    }
    
    menuMessage += "Please select an item by its number:";
    
    addBotMessage(menuMessage);
    
    setMessages(prev => [...prev, { 
      type: 'menu', 
      content: '',
      items: menuItems,
      hasBack: true
    }]);
  };

  const processUserInput = (input) => {
    switch(input) {
      case '1':
        showMenu();
        break;
      case '99':
        checkoutOrder();
        break;
      case '98':
        showOrderHistory();
        break;
      case '97':
        showCurrentOrder();
        break;
      case '0':
        cancelOrder();
        break;
      case 'back':
        addBotMessage("What would you like to do?");
        showOptions();
        break;
      default:
        // Check if input is a menu item number
        // eslint-disable-next-line no-case-declarations
        const itemId = parseInt(input);
        // eslint-disable-next-line no-case-declarations
        const selectedItem = menuItems.find(item => item.id === itemId);
        
        if (selectedItem) {
          addToOrder(selectedItem);
        } else {
          addBotMessage("I didn't understand that. Please select a valid option.");
          showOptions();
        }
    }
  };

  const handleOptionSelect = (value) => {
    setInputValue(value);
    handleSendMessage();
  };

  const addToOrder = (item) => {
    const updatedOrder = [...currentOrder, item];
    setCurrentOrder(updatedOrder);
    localStorage.setItem(`${sessionId}_currentOrder`, JSON.stringify(updatedOrder));
    addBotMessage(`Added ${item.name} to your order. Would you like to add something else?`);
    showMenu();
  };

  const checkoutOrder = () => {
    if (currentOrder.length === 0) {
      addBotMessage("No order to place. Would you like to place an order?");
      showOptions();
      return;
    }
    
    addBotMessage("Your order has been placed! Now let's proceed to payment.");
    
    // Calculate total
    const total = currentOrder.reduce((sum, item) => sum + item.price, 0);
    
    // Show order summary
    let summary = "<strong>Order Summary:</strong><br>";
    currentOrder.forEach(item => {
      summary += `${item.name} - ₦${item.price}<br>`;
    });
    summary += `<br><strong>Total: ₦${total}</strong>`;
    
    addBotMessage(summary);
    
    // Simulate Paystack payment integration
    simulatePayment();
  };

  const simulatePayment = () => {
    addBotMessage("Simulating payment with Paystack...");
    
    setTimeout(() => {
      // Simulate successful payment
      addBotMessage("Payment successful! Thank you for your order.");
      
      // Add to order history
      const newOrder = {
        items: [...currentOrder],
        total: currentOrder.reduce((sum, item) => sum + item.price, 0),
        date: new Date().toISOString(),
        paymentReference: 'ref_' + Date.now()
      };
      
      const updatedHistory = [...orderHistory, newOrder];
      setOrderHistory(updatedHistory);
      localStorage.setItem(`${sessionId}_orderHistory`, JSON.stringify(updatedHistory));
      
      // Clear current order
      setCurrentOrder([]);
      localStorage.setItem(`${sessionId}_currentOrder`, JSON.stringify([]));
      
      // Show options after payment
      setTimeout(() => {
        addBotMessage("What would you like to do next?");
        showOptions();
      }, 1000);
    }, 3000);
  };

  const showOrderHistory = () => {
    if (orderHistory.length === 0) {
      addBotMessage("You haven't placed any orders yet.");
      showOptions();
      return;
    }
    
    let historyMessage = "<strong>Your order history:</strong><br><br>";
    
    orderHistory.forEach((order, index) => {
      historyMessage += `<strong>Order ${index + 1}</strong> (${new Date(order.date).toLocaleDateString()}):<br>`;
      order.items.forEach(item => {
        historyMessage += `- ${item.name}: ₦${item.price}<br>`;
      });
      historyMessage += `Total: ₦${order.total}<br><br>`;
    });
    
    addBotMessage(historyMessage);
    showOptions();
  };

  const showCurrentOrder = () => {
    if (currentOrder.length === 0) {
      addBotMessage("Your current order is empty.");
      showOptions();
      return;
    }
    
    let orderMessage = "<strong>Your current order:</strong><br><br>";
    const total = currentOrder.reduce((sum, item) => sum + item.price, 0);
    
    currentOrder.forEach(item => {
      orderMessage += `- ${item.name}: ₦${item.price}<br>`;
    });
    
    orderMessage += `<br><strong>Total: ₦${total}</strong><br>`;
    
    addBotMessage(orderMessage);
    showOptions();
  };

  const cancelOrder = () => {
    if (currentOrder.length === 0) {
      addBotMessage("No order to cancel.");
    } else {
      setCurrentOrder([]);
      localStorage.setItem(`${sessionId}_currentOrder`, JSON.stringify([]));
      addBotMessage("Your order has been cancelled.");
    }
    
    showOptions();
  };

  // Render message based on type
  const renderMessage = (message, index) => {
    if (message.type === 'user') {
      return (
        <div key={index} className="message user-message">
          <div className="message-content">{message.content}</div>
        </div>
      );
    } else if (message.type === 'bot') {
      return (
        <div key={index} className="message bot-message">
          <div className="message-content" dangerouslySetInnerHTML={{ __html: message.content }} />
        </div>
      );
    } else if (message.type === 'typing') {
      return (
        <div key={index} className="message bot-message typing-indicator">
          <div className="message-content">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        </div>
      );
    } else if (message.type === 'options') {
      return (
        <div key={index} className="options">
          {message.options.map((option, i) => (
            <button 
              key={i} 
              className="option" 
              onClick={() => handleOptionSelect(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      );
    } else if (message.type === 'menu') {
      return (
        <div key={index} className="options">
          {message.items.map(item => (
            <button 
              key={item.id} 
              className="option" 
              onClick={() => handleOptionSelect(item.id.toString())}
            >
              {item.id}. {item.name} - ₦{item.price}
            </button>
          ))}
          {message.hasBack && (
            <button 
              className="option" 
              onClick={() => handleOptionSelect('back')}
            >
              Back to main menu
            </button>
          )}
        </div>
      );
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>FoodExpress ChatBot</h2>
        <p>We're here to take your order</p>
      </div>
      <div className="chat-messages">
        {messages.map((message, index) => renderMessage(message, index))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <input 
          type="text" 
          value={inputValue} 
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type your selection here..." 
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default RestaurantChatbot;