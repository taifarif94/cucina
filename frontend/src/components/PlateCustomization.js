import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { menuConfig } from "./menuConfig";
import { ShoppingCart, Trash2, Plus } from 'lucide-react';
import axios from 'axios';

const styles = {
    container: {
        width: '100%',
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '1rem',
        display: 'flex',
        gap: '2rem'
    },
    mainContent: {
        flex: 1
    },
    plateContainer: {
        width: '400px',
        height: '300px',
        margin: '0 auto 2rem',
        position: 'relative',
        border: '2px solid #333',
        backgroundColor: 'white',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(2, 1fr)',
        gap: '2px',
        padding: '2px'
    },
    square: {
        border: '1px solid #ccc',
        backgroundColor: '#f0f0f0',
        transition: 'background-color 0.3s'
    },
    squareHover: {
        backgroundColor: '#e0e0e0',
        cursor: 'pointer'
    },
    squareSelected: {
        backgroundColor: '#b3e0ff'
    },
    squareOccupied: {
        backgroundColor: '#d3d3d3'
    },
    button: {
        padding: '0.5rem 1rem',
        margin: '0.25rem',
        border: '1px solid #ccc',
        borderRadius: '4px',
        backgroundColor: 'white',
        cursor: 'pointer'
    },
    buttonPrimary: {
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        padding: '0.75rem 1.5rem',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    buttonDisabled: {
        backgroundColor: '#cccccc',
        cursor: 'not-allowed'
    },
    sidebar: {
        width: '300px'
    },
    componentCard: {
        padding: '1rem',
        marginBottom: '1rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
        position: 'relative'
    },
    deleteButton: {
        position: 'absolute',
        top: '0.5rem',
        right: '0.5rem',
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        fontSize: '1.2rem',
        color: '#dc3545'
    },
    selectionContainer: {
        textAlign: 'center',
        marginBottom: '1rem'
    },
    heading: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
        textAlign: 'center'
    },
    subHeading: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        marginBottom: '0.5rem'
    },
    layerControls: {
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        marginBottom: '1rem'
    },
    layerTabs: {
        display: 'flex',
        justifyContent: 'center',
        gap: '0.5rem',
        marginBottom: '1rem'
    },
    layerTab: {
        padding: '0.5rem 1rem',
        border: '1px solid #ccc',
        borderRadius: '4px',
        cursor: 'pointer',
        backgroundColor: 'white'
    },
    activeLayerTab: {
        backgroundColor: '#007bff',
        color: 'white',
        border: '1px solid #0056b3'
    },
    deleteLayerButton: {
        padding: '0.25rem 0.5rem',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        marginLeft: '0.5rem',
        cursor: 'pointer'
    },
    layerSection: {
        marginBottom: '2rem',
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px'
    },
    cartSection: {
        backgroundColor: 'white',
        padding: '1rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: '1rem'
    },
    cartItem: {
        padding: '0.5rem',
        borderBottom: '1px solid #eee',
        marginBottom: '0.5rem'
    },
    customizeButton: {
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        padding: '0.75rem 1.5rem',
        borderRadius: '4px',
        cursor: 'pointer',
        marginTop: '1rem',
        width: '100%'
    }
};

const PlateCustomization = ({ dishes = [] }) => {
	const [showInstructions, setShowInstructions] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [showPlateBuilder, setShowPlateBuilder] = useState(false);
    const [selectedDish, setSelectedDish] = useState(null);
    const [cart, setCart] = useState([]);
    const [selectedAddOns, setSelectedAddOns] = useState([]);
    const [selectedBeverages, setSelectedBeverages] = useState([]);
	const recommended_data = localStorage.getItem("filter_data");
	console.log("Recommended dishes:", recommended_data);
    // Plate Builder States
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [currentStep, setCurrentStep] = useState("initial");
    const [currentLayer, setCurrentLayer] = useState(0);
    const [layers, setLayers] = useState([{
        id: 0,
        components: []
    }]);
    const [selectionState, setSelectionState] = useState({
        category: null,
        subcategory: null,
        item: null,
        method: null,
        temp: null,
    });

    useEffect(() => {
        if (location.state?.dish_data) {
            console.log("Received raw dish data in plate:", location.state.dish_data);
            console.log("Recommended beverages before processing:", location.state.dish_data.recommended_beverage);
            
            const addOnsArray = location.state.dish_data.add_ons
                ? location.state.dish_data.add_ons.split(', ').map(addon => ({
                    name: addon,
                    price: 2.50
                }))
                : [];
                
            // Get recommended beverages from API or use defaults
            const recommendedBeverages = location.state.dish_data.recommended_beverage && 
                                       location.state.dish_data.recommended_beverage.length > 0
                ? location.state.dish_data.recommended_beverage.map(bev => ({
                    name: bev.name,
                    price: parseFloat(bev.price)
                  }))
                : [
                    { name: "Soft Drink", price: 2.00 },
                    { name: "Iced Tea", price: 2.50 },
                    { name: "Lemonade", price: 2.00 }
                  ];
            
            const processedDish = {
                ...location.state.dish_data,
                parsedAddOns: addOnsArray,
                recommended_beverage: recommendedBeverages
            };
            
            console.log("Processed dish data:", processedDish);
            console.log("Final recommended beverages being set:", processedDish.recommended_beverage);
            
            setSelectedDish(processedDish);
            setShowPlateBuilder(false);
        }
    }, [location.state]);

    const handleAddToCart = (item) => {
        if (item.type === 'custom') {
            setCart([...cart, {
                id: Date.now(),
                type: 'custom',
                layers: layers,
                price: calculateCustomPlatePrice()
            }]);
            resetPlateBuilder();
        } else {
            setCart([...cart, {
        id: Date.now(),
        type: 'dish',
        dish: selectedDish,
        addOns: selectedAddOns,
        beverages: selectedBeverages,
        price: calculateDishPrice(),
    }]);
    setSelectedAddOns([]);
    setSelectedBeverages([]);
        }
    };

    const handleRemoveFromCart = (itemId) => {
        setCart(cart.filter(item => item.id !== itemId));
    };

    const handleAddonToggle = (addon) => {
        if (selectedAddOns.includes(addon)) {
            setSelectedAddOns(selectedAddOns.filter(item => item !== addon));
        } else {
            setSelectedAddOns([...selectedAddOns, addon]);
        }
    };
	
	const handleBeverageToggle = (beverage) => {
    setSelectedBeverages((prev) =>
        prev.includes(beverage)
            ? prev.filter((b) => b !== beverage) // Remove if already selected
            : [...prev, beverage] // Add if not selected
    );
	};


const calculateDishPrice = () => {
    let total = selectedDish ? Number(selectedDish.price || 0) : 0;
    
    // Add up all add-ons
    total += selectedAddOns.reduce((sum, addon) => sum + Number(addon.price || 0), 0);
    
    // Add up all selected beverages
    total += selectedBeverages.reduce((sum, beverage) => sum + Number(beverage.price || 0), 0);
    
    return total;
};


    const calculateCustomPlatePrice = () => {
        return layers.reduce((total, layer) => {
            return total + layer.components.reduce((layerTotal, comp) => {
                return layerTotal + Number(comp.price || 5);
            }, 0);
        }, 0);
    };

    const calculateTotalPrice = () => {
        return cart.reduce((total, item) => total + Number(item.price || 0), 0);
    };

    // Plate Builder Functions
    const addLayer = () => {
        if (layers.length < 5) {
            const newLayer = {
                id: layers.length,
                components: []
            };
            setLayers([...layers, newLayer]);
            setCurrentLayer(newLayer.id);
        }
    };

    const deleteLayer = (layerId) => {
        if (layers.length > 1) {
            const newLayers = layers.filter(layer => layer.id !== layerId);
            const updatedLayers = newLayers.map((layer, index) => ({
                ...layer,
                id: index
            }));
            setLayers(updatedLayers);
            setCurrentLayer(Math.min(layerId, updatedLayers.length - 1));
        }
    };

    const isSquareOccupied = (index) => {
        return layers[currentLayer].components.some(comp => {
            if (comp.spaces === 4) {
                const occupiedSquares = comp.position === 0 
                    ? [0, 1, 3, 4] 
                    : [1, 2, 4, 5];
                return occupiedSquares.includes(index);
            } else {
                return comp.position === index;
            }
        });
    };

    const handleSquareClick = (index) => {
        if (currentStep !== "select-square" || isSquareOccupied(index)) return;
        setSelectedSquare(index);
        setCurrentStep("select-category");
    };

    const deleteComponent = (layerId, componentIndex) => {
        const updatedLayers = layers.map(layer => {
            if (layer.id === layerId) {
                return {
                    ...layer,
                    components: layer.components.filter((_, i) => i !== componentIndex)
                };
            }
            return layer;
        });
        setLayers(updatedLayers);
    };

    const resetSelections = () => {
        setSelectedSquare(null);
        setSelectionState({
            category: null,
            subcategory: null,
            item: null,
            method: null,
            temp: null,
        });
        setCurrentStep("initial");
    };

    const resetPlateBuilder = () => {
        setLayers([{
            id: 0,
            components: []
        }]);
        setCurrentLayer(0);
        resetSelections();
    };

    const handleItemSelect = (item) => {
    setSelectionState(prev => ({ ...prev, item }));
    if (selectionState.category === "Condiments") {
        // For condiments, directly add the component without method selection
        addComponent(null);  // Pass null for method since condiments don't need cooking methods
    } else {
        setCurrentStep("select-method");
    }
};

    const addComponent = (method, temp = null) => {
    const spaces = 
        selectionState.category === "Protein" &&
        selectionState.subcategory === "Beef"
            ? 4
            : 1;

    // Create the component object with all necessary fields
    const newComponent = {
        position: selectedSquare,
        spaces: spaces,
        category: selectionState.category,
        subcategory: selectionState.subcategory,
        item: selectionState.item, // This should contain the actual condiment name
        // Only include method and temp for non-condiments
        ...(selectionState.category !== "Condiments" && {
            method: method,
            temp: temp
        })
    };

    const updatedLayers = layers.map(layer => {
        if (layer.id === currentLayer) {
            return {
                ...layer,
                components: [...layer.components, newComponent]
            };
        }
        return layer;
    });

    setLayers(updatedLayers);
    resetSelections();
};

    const handleCategorySelect = (category) => {
    setSelectionState(prev => ({ ...prev, category }));
    // Clear previous subcategory and item when selecting a new category
    setSelectionState(prev => ({ ...prev, subcategory: null, item: null }));
    
    // Check if the category has subcategories (is an object with nested structure)
    const categoryData = menuConfig.foodOptions[category];
    if (typeof categoryData === 'object' && 
        !Array.isArray(categoryData) && 
        categoryData !== null) {
        setCurrentStep("select-subcategory");
    } else if (Array.isArray(categoryData) && categoryData.length > 0) {
        setCurrentStep("select-item");
    }
};

    const handleSubcategorySelect = (subcategory) => {
    setSelectionState(prev => ({ ...prev, subcategory }));
    const items = menuConfig.foodOptions[selectionState.category][subcategory];
    if (Array.isArray(items) && items.length > 0) {
        setCurrentStep("select-item");
    }
};

    const handleMethodSelect = (method) => {
    // For condiments, we don't need cooking methods - directly add the component
    if (selectionState.category === "Condiments") {
        addComponent(""); // Empty string for method since it's not applicable
        return;
    }

    // For other items, proceed with normal method selection
    setSelectionState(prev => ({ ...prev, method }));
    if (selectionState.category === "Protein" && 
        selectionState.subcategory === "Beef") {
        setCurrentStep("select-temp");
    } else {
        addComponent(method);
    }
};

    const handleTempSelect = (temp) => {
        addComponent(selectionState.method, temp);
    };

    return (
        <div style={styles.container}>
            {/* Left Sidebar - Menu or Categories */}
            <div style={styles.sidebar}>
                <button 
                    style={styles.buttonPrimary}
                    onClick={() => setShowPlateBuilder(!showPlateBuilder)}
                    className="w-full mb-4"
                >
                    {showPlateBuilder ? 'Back to Menu' : 'Build Custom Plate'}
                </button>
				
				<button
					style={styles.buttonPrimary}
					onClick={() => setShowInstructions(true)}
					className="w-full mb-4"
				>
					How to Build Your Plate
				</button>

                {!showPlateBuilder && (
                    <div>
                        <h2 style={styles.heading}>Menu</h2>
                        {!dishes?.length && (
                            <div className="text-center py-4 text-gray-500">
							No menu items available
                            </div>
                        )}
                        
                        {/* Appetizers Section */}
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-3 pb-2 border-b border-gray-200">
                                Appetizers
                            </h3>
                            <ul className="space-y-2">
                                {dishes?.filter(dish => dish.food_category === "Appetizers")?.map(dish => (
                                    <li 
                                        key={dish.dish_id} 
                                        className="p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors"
                                        onClick={async () => {
                                            try {
                                                console.log("Fetching full dish data for:", dish.dish_id);
                                                const response = await axios.post("http://localhost:5000/api/dish", {
                                                    dishId: dish.dish_id,
                                                });
                                                console.log("Full dish data received:", response.data);
                                                
                                                setSelectedDish({
                                                    ...response.data,
                                                    parsedAddOns: response.data.add_ons ? response.data.add_ons.split(', ').map(addon => ({
                                                        name: addon,
                                                        price: 2.50
                                                    })) : []
                                                });
                                                setShowPlateBuilder(false);
                                            } catch (error) {
                                                console.error("Error fetching full dish data:", error);
                                            }
                                        }}
                                    >
                                        <div className="font-medium">{dish.name}</div>
                                        <div className="text-sm text-gray-600">
                                            {dish.allergens ? `Allergens: ${dish.allergens}` : 'No Allergens'}
                                        </div>
                                        <div className="flex justify-between items-center mt-1">
                                            <div className="text-sm text-gray-800">${dish.price}</div>
                                            <button 
                                                className="text-blue-600 text-sm hover:text-blue-800"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedDish(dish);
                                                }}
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Main Courses Section */}
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-3 pb-2 border-b border-gray-200">
                                Main Courses
                            </h3>
                            <ul className="space-y-2">
                                {dishes?.filter(dish => dish.food_category === "Main Courses")?.map(dish => (
                                    <li 
                                        key={dish.dish_id} 
                                        className="p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors"
                                        onClick={async () => {
                                            try {
                                                console.log("Fetching full dish data for:", dish.dish_id);
                                                const response = await axios.post("http://localhost:5000/api/dish", {
                                                    dishId: dish.dish_id,
                                                });
                                                console.log("Full dish data received:", response.data);
                                                
                                                setSelectedDish({
                                                    ...response.data,
                                                    parsedAddOns: response.data.add_ons ? response.data.add_ons.split(', ').map(addon => ({
                                                        name: addon,
                                                        price: 2.50
                                                    })) : []
                                                });
                                                setShowPlateBuilder(false);
                                            } catch (error) {
                                                console.error("Error fetching full dish data:", error);
                                            }
                                        }}
                                    >
                                        <div className="font-medium">{dish.name}</div>
                                        <div className="text-sm text-gray-600">
                                            {dish.allergens ? `Allergens: ${dish.allergens}` : 'No Allergens'}
                                        </div>
                                        <div className="flex justify-between items-center mt-1">
                                            <div className="text-sm text-gray-800">${dish.price}</div>
                                            <button 
                                                className="text-blue-600 text-sm hover:text-blue-800"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedDish(dish);
                                                }}
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Desserts Section */}
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-3 pb-2 border-b border-gray-200">
                                Desserts
                            </h3>
                            <ul className="space-y-2">
                                {dishes?.filter(dish => dish.food_category === "Desserts")?.map(dish => (
                                    <li 
                                        key={dish.dish_id} 
                                        className="p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors"
                                        onClick={async () => {
                                            try {
                                                console.log("Fetching full dish data for:", dish.dish_id);
                                                const response = await axios.post("http://localhost:5000/api/dish", {
                                                    dishId: dish.dish_id,
                                                });
                                                console.log("Full dish data received:", response.data);
                                                
                                                setSelectedDish({
                                                    ...response.data,
                                                    parsedAddOns: response.data.add_ons ? response.data.add_ons.split(', ').map(addon => ({
                                                        name: addon,
                                                        price: 2.50
                                                    })) : []
                                                });
                                                setShowPlateBuilder(false);
                                            } catch (error) {
                                                console.error("Error fetching full dish data:", error);
                                            }
                                        }}
                                    >
                                        <div className="font-medium">{dish.name}</div>
                                        <div className="text-sm text-gray-600">
                                            {dish.allergens ? `Allergens: ${dish.allergens}` : 'No Allergens'}
                                        </div>
                                        <div className="flex justify-between items-center mt-1">
                                            <div className="text-sm text-gray-800">${dish.price}</div>
                                            <button 
                                                className="text-blue-600 text-sm hover:text-blue-800"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedDish(dish);
                                                }}
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
			{/* Main Content */}
            <div style={styles.mainContent}>
                {showPlateBuilder ? (
                    <div>
                        <h1 style={styles.heading}>Build Your Custom Plate</h1>
                        <div style={styles.plateContainer}>
                            {[...Array(6)].map((_, i) => {
                                const component = layers[currentLayer].components.find(comp => {
                                    if (comp.spaces === 4) {
                                        const occupiedSquares = comp.position === 0 ? [0, 1, 3, 4] : [1, 2, 4, 5];
                                        return occupiedSquares.includes(i);
                                    }
                                    return comp.position === i;
                                });
                                
                                const isLargeComponent = layers[currentLayer].components.some(comp => {
                                    if (comp.spaces === 4) {
                                        const occupiedSquares = comp.position === 0 ? [0, 1, 3, 4] : [1, 2, 4, 5];
                                        return occupiedSquares.includes(i);
                                    }
                                    return false;
                                });
                                
                                const isMainSquareOfLargeComponent = component?.spaces === 4 && component.position === i;
                                
                                if (!isLargeComponent || isMainSquareOfLargeComponent) {
                                    return (
                                        <div
                                            key={i}
                                            onClick={() => handleSquareClick(i)}
                                            style={{
                                                ...styles.square,
                                                ...(currentStep === 'select-square' &&
                                                    !isSquareOccupied(i) &&
                                                    styles.squareHover),
                                                ...(selectedSquare === i && styles.squareSelected),
                                                ...(isSquareOccupied(i) && styles.squareOccupied),
                                                ...(component?.spaces === 4 && {
                                                    gridColumn: 'span 2',
                                                    gridRow: 'span 2'
                                                }),
                                                position: 'relative'
                                            }}
                                        >
                                            {component && (
    <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4px',
        textAlign: 'center'
    }}>
        <div style={{
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#1f2937'
        }}>
            {/* Always show the item name */}
            <div>{component.item}</div>
            
            {/* Show subcategory for condiments */}
            {component.category === "Condiments" && (
                <div style={{
                    fontSize: '0.75rem',
                    color: '#4b5563'
                }}>
                    {component.subcategory}
                </div>
            )}
            
            {/* Show cooking details for non-condiments */}
            {component.category !== "Condiments" && component.method && (
                <>
                    {component.temp && (
                        <div style={{
                            fontSize: '0.75rem',
                            color: '#4b5563'
                        }}>
                            {component.temp}
                        </div>
                    )}
                    <div style={{
                        fontSize: '0.75rem',
                        color: '#4b5563'
                    }}>
                        {component.method}
                    </div>
                </>
            )}
        </div>
    </div>
)}
                                        </div>
                                    );
                                }
                                return <div key={i} style={{ display: 'none' }} />;
                            })}
                        </div>

                        {/* Layer Controls */}
                        <div style={styles.layerControls}>
                            <button 
                                style={styles.button}
                                onClick={addLayer}
                                disabled={layers.length >= 5}
                            >
                                <Plus size={16} className="mr-1" />
                                Add Layer
                            </button>
                        </div>

                        {/* Layer Tabs */}
                        <div style={styles.layerTabs}>
                            {layers.map((layer) => (
                                <div key={layer.id} className="flex items-center">
                                    <button
                                        style={{
                                            ...styles.layerTab,
                                            ...(currentLayer === layer.id && styles.activeLayerTab)
                                        }}
                                        onClick={() => setCurrentLayer(layer.id)}
                                    >
                                        Layer {layer.id + 1}
                                    </button>
                                    {layers.length > 1 && (
                                        <button
                                            style={styles.deleteLayerButton}
                                            onClick={() => deleteLayer(layer.id)}
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
						{/* Component Selection */}
                        <div style={styles.selectionContainer}>
                            {currentStep === "initial" && (
                                <button
                                    style={styles.buttonPrimary}
                                    onClick={() => setCurrentStep("select-square")}
                                >
                                    Add Component
                                </button>
                            )}

                            {currentStep === "select-category" && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Select Category</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {Object.keys(menuConfig.foodOptions).map((category) => (
                                            <button
                                                key={category}
                                                onClick={() => handleCategorySelect(category)}
                                                className="p-2 bg-white border rounded hover:bg-gray-50"
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {currentStep === "select-subcategory" && (
    <div>
        <h3 className="text-lg font-semibold mb-3">Select Type</h3>
        <div className="grid grid-cols-2 gap-2">
            {(() => {
                const category = selectionState.category;
                if (category === 'Condiments') {
                    return ['Sauces', 'Toppings', 'Garnish'].map((subcategory) => (
                        <button
                            key={subcategory}
                            type="button"
                            onClick={() => {
                                console.log('Clicked subcategory:', subcategory);
                                handleSubcategorySelect(subcategory);
                            }}
                            className="p-2 bg-white border rounded hover:bg-gray-50 cursor-pointer"
                        >
                            {subcategory}
                        </button>
                    ));
                } else if (category === 'Protein') {
                    return Object.keys(menuConfig.foodOptions.Protein).map((subcategory) => (
                        <button
                            key={subcategory}
                            type="button"
                            onClick={() => handleSubcategorySelect(subcategory)}
                            className="p-2 bg-white border rounded hover:bg-gray-50 cursor-pointer"
                        >
                            {subcategory}
                        </button>
                    ));
                }
                return null;
            })()}
        </div>
    </div>
)}

                            {currentStep === "select-item" && (
    <div>
        <h3 className="text-lg font-semibold mb-3">Select Item</h3>
        <div className="grid grid-cols-2 gap-2">
            {(() => {
                let items;
                if (selectionState.category === "Protein") {
                    items = menuConfig.foodOptions.Protein[selectionState.subcategory];
                } else if (selectionState.category === "Condiments") {
                    items = menuConfig.foodOptions.Condiments[selectionState.subcategory];
                } else {
                    items = menuConfig.foodOptions[selectionState.category];
                }
                return Array.isArray(items) ? items.map((item) => (
                    <button
                        key={item}
                        onClick={() => handleItemSelect(item)}
                        className="p-2 bg-white border rounded hover:bg-gray-50"
                    >
                        {item}
                    </button>
                )) : null;
            })()}
        </div>
    </div>
)}

                            {currentStep === "select-method" && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Select Cooking Method</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(menuConfig.cookingMethods[selectionState.subcategory || selectionState.category] || 
                                          ["Roasted", "Raw"]).map((method) => (
                                            <button
                                                key={method}
                                                onClick={() => handleMethodSelect(method)}
                                                className="p-2 bg-white border rounded hover:bg-gray-50"
                                            >
                                                {method}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {currentStep === "select-temp" && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Select Temperature</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {menuConfig.temperatures.slice(0, 5).map((temp) => (
                                            <button
                                                key={temp}
                                                onClick={() => handleTempSelect(temp)}
                                                className="p-2 bg-white border rounded hover:bg-gray-50"
                                            >
                                                {temp}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Layer Components Display */}
                        <div style={styles.layerSection}>
    <h3 style={styles.subHeading}>Layer {currentLayer + 1} Components</h3>
    {layers[currentLayer].components.map((component, index) => (
        <div key={index} style={styles.componentCard}>
            <div>{component.item}</div>
            {component.category !== "Condiments" && component.method && (
                <div className="text-sm text-gray-600">
                    {component.method}
                    {component.temp && ` - ${component.temp}`}
                </div>
            )}
            {component.category === "Condiments" && (
                <div className="text-sm text-gray-600">
                    Condiment
                </div>
            )}
            <button
                style={styles.deleteButton}
                onClick={() => deleteComponent(currentLayer, index)}
            >
                ×
            </button>
        </div>
    ))}
</div>

                        {/* Add to Cart Button for Custom Plate */}
                        {layers.some(layer => layer.components.length > 0) && (
                            <button
                                style={styles.customizeButton}
                                onClick={() => handleAddToCart({ type: 'custom' })}
                            >
                                Add Custom Plate to Cart
                            </button>
                        )}
                    </div>
                ) : (
                    <div>
                        {selectedDish ? (
                            <div className="w-full bg-white rounded-lg shadow-md p-6">
                                {/* Dish Header */}
                                <div className="border-b pb-4 mb-4">
                                    <h2 className="text-2xl font-bold mb-2">{selectedDish.name}</h2>
                                    <p className="text-gray-600">{selectedDish.description}</p>
                                    <div className="mt-2 text-lg font-semibold">${selectedDish.price}</div>
                                </div>
								{/* Add-ons Section */}
                                {selectedDish.parsedAddOns && selectedDish.parsedAddOns.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold mb-3">Add-ons</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            {selectedDish.parsedAddOns.map((addon, index) => (
                                                <div
                                                    key={index}
                                                    onClick={() => handleAddonToggle(addon)}
                                                    className={`p-3 border rounded-lg cursor-pointer transition-colors
                                                        ${selectedAddOns.includes(addon) 
                                                            ? 'bg-blue-50 border-blue-500' 
                                                            : 'hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <span>{addon.name}</span>
                                                        <span className="text-gray-600">${Number(addon.price).toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

{/* Beverages Section */}
{selectedDish.recommended_beverage && selectedDish.recommended_beverage.length > 0 && (
    <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Beverages</h3>
        <div className="grid grid-cols-2 gap-4">
            {selectedDish.recommended_beverage.map((beverage, index) => (
                <div
                    key={index}
                    onClick={() => handleBeverageToggle(beverage)}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors
                        ${selectedBeverages.includes(beverage) 
                            ? 'bg-blue-50 border-blue-500' 
                            : 'hover:bg-gray-50'
                        }`}
                >
                    <div className="flex justify-between items-center">
                        <span>{beverage.name}</span>
                        <span className="text-gray-600">${Number(beverage.price).toFixed(2)}</span>
                    </div>
                </div>
            ))}
        </div>
    </div>
)}

{/* Allergens Warning */}
{selectedDish.allergens && (
    <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-sm font-semibold text-yellow-800">Allergen Information</h3>
        <p className="text-sm text-yellow-700">{selectedDish.allergens}</p>
    </div>
)}

                                {/* Total Price Calculation */}
<div className="border-t pt-4 mt-4">
    <div className="flex justify-between items-center mb-4">
        <span className="font-semibold">Base Price:</span>
        <span>${selectedDish.price}</span>
    </div>
    {selectedAddOns.length > 0 && (
        <div className="flex justify-between items-center mb-4">
            <span className="font-semibold">Add-ons:</span>
            <span>${selectedAddOns.reduce((sum, addon) => sum + addon.price, 0).toFixed(2)}</span>
        </div>
    )}
    {selectedBeverages.length > 0 && (
        <div className="flex justify-between items-center mb-4">
            <span className="font-semibold">Beverages:</span>
            <span>${selectedBeverages.reduce((sum, beverage) => sum + Number(beverage.price), 0).toFixed(2)}</span>
        </div>
    )}
    <div className="flex justify-between items-center text-lg font-bold">
        <span>Total:</span>
        <span>${calculateDishPrice().toFixed(2)}</span>
    </div>
</div>

                                {/* Add to Cart Button */}
                                <button
                                    onClick={() => handleAddToCart({ type: 'dish' })}
                                    className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-64">
                                <p className="text-xl text-gray-500">
                                    Select a dish from the menu to see details
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Right Sidebar - Cart */}
            <div style={styles.sidebar}>
                <div style={styles.cartSection}>
                    <h2 style={styles.heading}>Your Cart</h2>
                    {cart.map((item) => (
                        <div key={item.id} style={styles.cartItem}>
                            {item.type === 'dish' ? (
                                <div>
                                    <h3 className="font-semibold">{item.dish.name}</h3>
                                    {item.addOns.length > 0 && (
                                        <p className="text-sm text-gray-600">
                                            Add-ons: {item.addOns.map(addon => addon.name).join(', ')}
                                        </p>
                                    )}
                                    {item.beverage && (
                                        <p className="text-sm text-gray-600">
                                            Beverage: {item.beverage.name}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <h3 className="font-semibold">Custom Plate</h3>
                                    {item.layers.map((layer, idx) => (
                                        <p key={idx} className="text-sm text-gray-600">
                                            Layer {idx + 1}: {layer.components.length} components
                                        </p>
                                    ))}
                                </div>
                            )}
                            <div className="flex justify-between items-center mt-2">
                                <span className="font-semibold">${Number(item.price).toFixed(2)}</span>
                                <button
                                    onClick={() => handleRemoveFromCart(item.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="mt-4 pt-4 border-t">
                        <div className="flex justify-between items-center font-bold">
                            <span>Total:</span>
                            <span>${calculateTotalPrice().toFixed(2)}</span>
                        </div>
                        {cart.length > 0 && (
                            <button
                                className="w-full mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                                onClick={() => navigate('/review', { state: { cart } })}
                            >
                                Proceed to Checkout
                            </button>
                        )}
                    </div>
                </div>
            </div>
			{showInstructions && (
    <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
    }}>
        <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '1.5rem',
            maxWidth: '600px',
            textAlign: 'center'
        }}>
            <h2 style={{ marginBottom: '1rem' }}>Welcome to the Build Your Plate feature!</h2>
            <p style={{ whiteSpace: 'pre-wrap', marginBottom: '1rem' }}>
				<p>- A plate consists of layers, and each layer can have multiple components.</p>
				<p>- Start by selecting the Add Componenet button.</p>
				<p>- Then select an empty square on the plate grid.</p>
				<p>- Choose a category (e.g., Protein, Vegetables, etc.).</p>
				<p>- Select an item and the desired cooking method.</p>
				<p>- Add additional layers as needed to place ingredents on top of the components already placed on the plate.</p>
				<p>- You can select a previous layer to make changes.</p>
				<p>- You can view a summary of your selections and finalize your custom plate!</p>
            </p>
            <button
                style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
                onClick={() => setShowInstructions(false)}
            >
                Close
            </button>
        </div>
    </div>
)}

        </div>
    );
};

export default PlateCustomization;