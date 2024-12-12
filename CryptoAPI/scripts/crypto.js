// Debounce utility function
function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// Section DOM elements
const sections = {
    top: document.getElementById('top'),
    trending: document.getElementById('trending'),
    gainers: document.getElementById('gainers'),
    losers: document.getElementById('losers'),
};

// Tabs DOM elements
const tabs = {
    top: document.getElementById('top-tab'),
    trending: document.getElementById('trending-tab'),
    gainers: document.getElementById('gainers-tab'),
    losers: document.getElementById('losers-tab'),
};

const hamButton = document.querySelector('#menu');
const navigation = document.querySelector('.navigation');

hamButton.addEventListener('click', () => {
	navigation.classList.toggle('open');
	hamButton.classList.toggle('open');
});


const toggleButton = document.getElementById('toggleTheme');

// Check for dark mode preference in localStorage when the page loads
if (localStorage.getItem('dark-mode') === 'enabled') {
    document.body.classList.add('dark-mode');
}

// Toggle dark mode when the button is clicked
toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    // Save the current theme state to localStorage
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('dark-mode', 'enabled');
    } else {
        localStorage.removeItem('dark-mode');
    }
}); 

// Function to switch between sections
function switchSection(sectionId) {
    // Hide all sections
    for (let key in sections) {
        sections[key].classList.add('hidden');
    }
    
    // Show the selected section
    sections[sectionId].classList.remove('hidden');
    
    // Update the active section
    activeSection = sectionId;
}

// Debounced fetch functions
const debouncedFetchTop = debounce(fetchTop, 500);
const debouncedFetchTrending = debounce(fetchTrending, 500);
const debouncedFetchGainers = debounce(fetchGainers, 500);
const debouncedFetchLosers = debounce(fetchLosers, 500);

// Base URL and API key for CryptoCompare
const baseUrl = 'https://min-api.cryptocompare.com/data';
const apiKey = '5c9670867db13c7c5992f42821203f012b4272a78860fecb0090819f986dab8c'; // Replace with your CryptoCompare API key


// Utility function to abbreviate numbers (e.g., 1,000,000 to 1M, 1,000,000,000 to 1B etc)
function abbreviateNumber(value) {
    if (value >= 1.0e12) {
        return (value / 1.0e12).toFixed(2) + "T"; // Trillions
    } else if (value >= 1.0e9) {
        return (value / 1.0e9).toFixed(2) + "B"; // Billions
    } else if (value >= 1.0e6) {
        return (value / 1.0e6).toFixed(2) + "M"; // Millions
    } else {
        return value.toLocaleString(); // Display full number for smaller values
    }
}



// Function to fetch and display Top 100 cryptos
function fetchTop() {
    const url = `${baseUrl}/top/mktcapfull?limit=100&tsym=USD&api_key=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('crypto-table-body');
            if (data.Message === "Success") {
                tableBody.innerHTML = data.Data.map((crypto, index) => {
                    const coin = crypto.CoinInfo;
                    const metrics = crypto.RAW?.USD;
                    if (!metrics) {
                        console.warn(`Skipping coin: ${crypto.CoinInfo?.FullName || 'Unknown'} - RAW.USD is undefined`);
                        return ''; // Skip rendering for this coin
                    }

                    // Determine the color for the 24h change based on whether it's positive or negative
                    const changeClass = metrics.CHANGEPCT24HOUR >= 0 ? 'positive-change' : 'negative-change';

                    return `
                        <tr>
                            <td>${index + 1}</td>
                            <td>
                                <img src="https://www.cryptocompare.com${coin.ImageUrl}" alt="${coin.FullName}" width="20">
                                ${coin.FullName} (${coin.Name})
                            </td>
                            <td>$${metrics.PRICE.toLocaleString()}</td>
                            <td class="${changeClass}">${metrics.CHANGEPCT24HOUR.toFixed(2)}%</td>
                            <td>
                                <span class="market-cap abbreviated">${abbreviateNumber(metrics.MKTCAP)}</span>
                                <span class="market-cap full-figure">${metrics.MKTCAP.toLocaleString()}</span>
                            </td>
                        </tr>
                    `;
                }).join('');
            } else {
                throw new Error(data.Message);
            }
        })
        .catch(error => {
            console.error('Error fetching Top coins:', error);
            document.getElementById('crypto-table-body').innerHTML = `
                <tr>
                    <td colspan="5">Failed to load Top Coins. Please try again later.</td>
                </tr>
            `;
            document.getElementById('coinChart').innerHTML = 'Error loading chart data'; // Show error in chart area
        });
}


let trendingChart = null;
// Function to fetch and display Trending coins
function fetchTrending() {
    const trendingUrl = 'https://api.coingecko.com/api/v3/search/trending';
    const btcUsdUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';

    // Fetch BTC to USD conversion rate
    fetch(btcUsdUrl)
        .then(response => response.json())
        .then(btcData => {
            const btcToUsd = btcData.bitcoin.usd; // Get BTC-USD conversion rate

            // Fetch trending coins
            return fetch(trendingUrl)
                .then(response => response.json())
                .then(data => {
                    const tableBody = document.getElementById('trending-table-body');
                    tableBody.innerHTML = data.coins.slice(0, 15).map((crypto, index) => {  // Show top 15 coins
                        // Convert BTC price to USD
                        const priceInUsd = (crypto.item.price_btc * btcToUsd).toFixed(2);

                        // Return HTML table row with data
                        return `
                            <tr>
                                <td>${index + 1}</td>
                                <td>
                                    <img src="${crypto.item.small}" alt="${crypto.item.name}" width="20">
                                    ${crypto.item.name} (${crypto.item.symbol.toUpperCase()})
                                </td>
                                <td>$${priceInUsd || '—'}</td>
                            </tr>
                        `;
                    }).join('');

                    // Now, let's display the trending chart
                    const labels = data.coins.slice(0, 10).map(crypto => crypto.item.symbol.toUpperCase()); // Top 10 coin names
                    const prices = data.coins.slice(0, 10).map(crypto => (crypto.item.price_btc * btcToUsd).toFixed(2)); // Top 10 prices in USD

                    // Get the context of the canvas element
                    const ctx = document.getElementById('trendingChart').getContext('2d');

                    // Check if a chart already exists on the canvas and destroy it
                    if (trendingChart !== null) {
                        trendingChart.destroy();
                    }
                    // Create the bar chart
                    trendingChart = new Chart(ctx, {
                        type: 'bar', // Bar chart
                        data: {
                            labels: labels, // x-axis labels (coin names)
                            datasets: [{
                                label: 'Prices in USD',
                                data: prices, // y-axis data (prices)
                                backgroundColor: 'rgba(255, 159, 64, 0.2)', // Light orange fill
                                borderColor: 'rgba(255, 159, 64, 1)', // Darker orange border
                                borderWidth: 1,
                            }]
                        },
                        options: {
                            responsive: true, // Chart resizes based on screen size
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    beginAtZero: true, // Ensure the y-axis starts at zero
                                    type: 'logarithmic', // Use logarithmic scale for better visibility of smaller values
                                    min: 0.01, // Avoid setting zero as minimum since log(0) is undefined
                                    ticks: {
                                        // Logarithmic scale adjusts tick spacing automatically
                                        autoSkip: true, // Skip ticks to avoid overcrowding
                                    }
                                }
                            },
                            plugins: {
                                legend: { display: true }, // Show legend
                                tooltip: { enabled: true }, // Show tooltips
                            }
                        }
                    });
                });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('trending-table-body').innerHTML = ` 
                <tr>
                    <td colspan="3">Failed to load Trending cryptos. Please try again later.</td>
                </tr>
            `;
            document.getElementById('trendingChart').innerHTML = 'Error loading chart data'; // Show error in chart area
        });
}


let gainersChart = null;
// Function to fetch and display Top Gainers
function fetchGainers() {
    const url = `${baseUrl}/top/totalvolfull?limit=50&tsym=USD&api_key=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('gainers-table-body');
            if (!data.Data || data.Data.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="5">No data available at the moment.</td>
                    </tr>
                `;
                return;
            }

            const sorted = data.Data
                .filter(crypto => crypto.RAW?.USD) // Exclude invalid entries
                .sort((a, b) => b.RAW.USD.CHANGEPCT24HOUR - a.RAW.USD.CHANGEPCT24HOUR)
                .slice(0, 15);

            tableBody.innerHTML = sorted.map((crypto, index) => {
                const coin = crypto.CoinInfo || { FullName: 'Unknown', Name: 'N/A', ImageUrl: '' };
                const metrics = crypto.RAW?.USD || { PRICE: 0, CHANGEPCT24HOUR: 0, MKTCAP: 0 };
                const imageUrl = coin.ImageUrl
                    ? `https://www.cryptocompare.com${coin.ImageUrl}`
                    : 'path/to/default/image.png';

                return `
                    <tr>
                        <td>${index + 1}</td>
                        <td>
                            <img src="${imageUrl}" alt="${coin.FullName}" width="20">
                            ${coin.FullName} (${coin.Name})
                        </td>
                        <td>$${metrics.PRICE.toLocaleString()}</td>
                        <td class="price-change-positive">${metrics.CHANGEPCT24HOUR.toFixed(2)}%</td>
                        <td>
                            <span class="market-cap abbreviated">${abbreviateNumber(metrics.MKTCAP)}</span>
                            <span class="market-cap full-figure">${metrics.MKTCAP.toLocaleString()}</span>
                        </td>
                    </tr>
                `;
            }).join('');

            // Generate chart data
            const labels = sorted.slice(0, 10).map(crypto => crypto.CoinInfo.Name);
            const dataPoints = sorted.slice(0, 10).map(crypto => crypto.RAW.USD.CHANGEPCT24HOUR);

            const ctx = document.getElementById('gainersChart').getContext('2d');
            // Check if a chart already exists on the canvas and destroy it

            // Check if a chart already exists on the canvas and destroy it
            if (gainersChart !== null) {
                gainersChart.destroy();
            }

            // Create the chart
            gainersChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: '24h % Change',
                        data: dataPoints,
                        backgroundColor: 'rgba(75, 192, 75, 0.2)', // Green background color
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: true },
                        tooltip: { enabled: true },
                    }
                }
            });
        })

        .catch(error => {
            console.error('Error fetching Gainers:', error);
            document.getElementById('gainers-table-body').innerHTML = `
                <tr>
                    <td colspan="5">Failed to load Gainers. Please try again later.</td>
                </tr>
            `;
            document.getElementById('gainersChart').innerHTML = 'Error loading chart data. Please Reload.'; // Show error in chart area
        });
}


let losersChart = null;
// Function to fetch and display Top Losers
function fetchLosers() {
    const url = `${baseUrl}/top/totalvolfull?limit=50&tsym=USD&api_key=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('losers-table-body');
            if (!data.Data || data.Data.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="5">No data available at the moment.</td>
                    </tr>
                `;
                return;
            }

            const sorted = data.Data
                .filter(crypto => crypto.RAW?.USD) // Exclude invalid entries
                .sort((a, b) => a.RAW.USD.CHANGEPCT24HOUR - b.RAW.USD.CHANGEPCT24HOUR)
                .slice(0, 15);

            tableBody.innerHTML = sorted.map((crypto, index) => {
                const coin = crypto.CoinInfo || { FullName: 'Unknown', Name: 'N/A', ImageUrl: '' };
                const metrics = crypto.RAW?.USD || { PRICE: 0, CHANGEPCT24HOUR: 0, MKTCAP: 0 };
                const imageUrl = coin.ImageUrl
                    ? `https://www.cryptocompare.com${coin.ImageUrl}`
                    : 'path/to/default/image.png';

                return `
                    <tr>
                        <td>${index + 1}</td>
                        <td>
                            <img src="${imageUrl}" alt="${coin.FullName}" width="20">
                            ${coin.FullName} (${coin.Name})
                        </td>
                        <td>$${metrics.PRICE.toLocaleString()}</td>
                        <td class="price-change-negative">${metrics.CHANGEPCT24HOUR.toFixed(2)}%</td>
                        <td>
                            <span class="market-cap abbreviated">${abbreviateNumber(metrics.MKTCAP)}</span>
                            <span class="market-cap full-figure">${metrics.MKTCAP.toLocaleString()}</span>
                        </td>
                    </tr>
                `;
            }).join('');

            // Generate chart data
            const labels = sorted.slice(0, 10).map(crypto => crypto.CoinInfo.Name);
            const dataPoints = sorted.slice(0, 10).map(crypto => crypto.RAW.USD.CHANGEPCT24HOUR);

            // Create the chart
            const ctx = document.getElementById('losersChart').getContext('2d');

            // Check if a chart already exists on the canvas and destroy it
            if (losersChart !== null) {
                losersChart.destroy();
            }

            losersChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: '24h % Change',
                        data: dataPoints,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)', // Red for losers
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: true },
                        tooltip: { enabled: true },
                    }
                }
            });
        })
        
        .catch(error => {
            console.error('Error fetching Losers:', error);
            document.getElementById('losers-table-body').innerHTML = `
                <tr>
                    <td colspan="5">Failed to load Losers. Please try again later.</td>
                </tr>
            `;
            document.getElementById('losersChart').innerHTML = 'Error loading chart data. Please Reload.'; // Show error in chart area
        });
}


// Automatically close hamburger menu on tab click
function closeHamburgerMenu() {
    navigation.classList.remove('open');
    hamButton.classList.remove('open');
}

// Add click event listeners to tabs
tabs.top.addEventListener('click', event => {
    event.preventDefault();
    closeHamburgerMenu();
    switchSection('top');
    debouncedFetchTop();
});

tabs.trending.addEventListener('click', event => {
    event.preventDefault();
    closeHamburgerMenu();
    switchSection('trending');
    debouncedFetchTrending();
});

tabs.gainers.addEventListener('click', event => {
    event.preventDefault();
    closeHamburgerMenu();
    switchSection('gainers');
    debouncedFetchGainers();
});

tabs.losers.addEventListener('click', event => {
    event.preventDefault();
    closeHamburgerMenu();
    switchSection('losers');
    debouncedFetchLosers();
});



// Initial load
document.addEventListener('DOMContentLoaded', () => {
    switchSection('top');
    debouncedFetchTop();
});

function fetchChartData() {
    const url = `${baseUrl}/top/mktcapfull?limit=10&tsym=USD&api_key=${apiKey}`;
    const errorElement = document.getElementById('chart-error');
    const chartCanvas = document.getElementById('coinChart');

    // Clear previous error
    errorElement.style.display = 'none';
    chartCanvas.style.display = 'block';

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!data.Data || data.Data.length === 0) {
                throw new Error('No data available from the API');
            }

            // Filter out entries without valid RAW.USD.MKTCAP
            const validData = data.Data.filter(crypto => 
                crypto.RAW && crypto.RAW.USD && crypto.RAW.USD.MKTCAP
            );

            if (validData.length === 0) {
                throw new Error('No valid market cap data available.');
            }

            const labels = validData.map(crypto => crypto.CoinInfo.Name);
            let marketCaps = validData.map(crypto => crypto.RAW.USD.MKTCAP);

            // Function to format market cap based on scale
            const formatMarketCap = (cap) => {
                if (cap >= 1e12) { // Trillion
                    return (cap / 1e12).toFixed(1) + 'T';
                } else if (cap >= 1e9) { // Billion
                    return (cap / 1e9).toFixed(1) + 'B';
                } else if (cap >= 1e6) { // Million
                    return (cap / 1e6).toFixed(1) + 'M';
                } else {
                    return cap; // For values below million, display the full number
                }
            };

            console.log('Labels:', labels);
            console.log('Market Caps:', marketCaps);

            // Format market cap values for the chart labels, keeping original numbers for data
            const formattedMarketCaps = marketCaps.map(cap => formatMarketCap(cap));

            // Create the chart
            const ctx = chartCanvas.getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels, // Labels remain as crypto names
                    datasets: [{
                        label: 'Market Cap (USD)',
                        data: marketCaps, // Using original marketCap values for chart's y-axis calculation
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                // Optional: Display the full market cap value on the y-axis
                                callback: function(value) {
                                    if (window.innerWidth > 817) {
                                        return value.toLocaleString(); // Full value for desktop
                                    } else {
                                        return formatMarketCap(value); // Abbreviated format for mobile
                                    }
                                }
                            },
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error fetching chart data:', error);

            // Show error message
            chartCanvas.style.display = 'none'; // Hide the canvas
            errorElement.style.display = 'block'; // Show the error message
            errorElement.textContent = 'Failed to load chart data. Please try again later.';
        });
}



fetchChartData();

document.addEventListener('DOMContentLoaded', function() {
//addition of active class to highlight current tab the user is on
    document.querySelectorAll('.tab').forEach(link => {
        link.addEventListener('click', function () {
        // Remove 'active' class from all links
        document.querySelectorAll('.tab').forEach(item => item.classList.remove('active'));
    
        // Add 'active' class to the clicked link
        this.classList.add('active');
        });
    });
});


function filterCoins() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#crypto-table-body tr');
    rows.forEach(row => {
        const coinName = row.cells[1].textContent.toLowerCase();
        if (coinName.includes(searchQuery)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}  