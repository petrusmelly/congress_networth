// Shortened display names

        displayNames = {
            'il_district': 'District',
            'IL_Congressional_NetWorth$.Congressperson': 'Congressperson',
            'IL_Congressional_NetWorth$.Average_Net_Worth': 'Avg. Net Worth',
            'IL_Congressional_NetWorth$.B19013_001E___Median_Household_': 'Median Household Income',
            'wealth_index': 'Wealth Disparity Score'
        };

        const MB_token = 'pk.eyJ1IjoicGV0cnVzbWVsbHkiLCJhIjoiY21jNmk5OWxsMG1nYTJucHgyYjA2cjN5ZyJ9.m2O9DLKhe3A1GNNVTexNig';

        mapboxgl.accessToken = MB_token;
        const map = new mapboxgl.Map({
            container: 'map', // container ID
            style: 'mapbox://styles/mapbox/satellite-v9', // style URL
            center: [-89, 40.6], // starting position [lng, lat]
            zoom: 5, // starting zoom
        });

        const card = document.getElementById('properties');

        const intro = `
        <p>Click on a congressional district to see that representative’s estimated net worth, the median annual income of their district, and a wealth disparity score for comparison.</p>

        <p>The <b>wealth disparity index</b> compares a representative’s net worth to the income of the people they represent. It answers the question: how much more (or less) wealth does a congressperson have compared to the typical household in their district?</p>

        <p>The score is calculated by subtracting the median household income from the representative’s net worth, then dividing the result by the median income. In other words:  
        <b><em>(Net Worth − Median Income) ÷ Median Income</em></b>.</p>

        <p>A score of 0 means the representative’s net worth is equal to the district’s median income. A score of 1 means they have twice as much. A score of 2 means three times as much, and so on. Negative scores indicate the representative has <em>less</em> wealth than the typical household in their district.</p>

        <p>For example, a score of <b>200</b> means the representative's net worth is <b>201 times greater</b> than the district’s median income—a disparity of 20,000%.</p>

        <p>Additional methodology details can be found at the bottom of the page as well as links to sources.</p>
        `;

        card.innerHTML = intro;

        const showCard = (feature) => {
            const listItems = Object.entries(feature.properties).filter(([key]) => displayNames[key]).map(([key, value]) => {
                let formattedValue = value;
                if (typeof value === 'number' && key !== 'il_district' && key !== 'wealth_index') {
                    formattedValue = `$${value.toLocaleString()}`;
                }
                return `<li><b>${displayNames[key]}</b>: ${formattedValue}</li>`
            })
                .join('');

            card.innerHTML = `
            <div class="map-overlay-inner">
                <span id='district-heading'>${feature.properties.il_district} – ${feature.properties['IL_Congressional_NetWorth$.Congressperson']}</span>
                <hr>
                <ul>${listItems}</ul>
                <br><button id="show-intro-btn">Show Intro</button>
                </div>`;

            card.style.display = 'block';

            // Click event listener for the button to toggle back to introduction/instructions
            document.getElementById('show-intro-btn').addEventListener('click', () => {
                card.innerHTML = intro;
            });
        };

        map.on('load', () => {
            // Adding our GeoJSON data to the map
            map.addSource('congress-networth', {
                type: 'geojson',
                data: 'congress_nw.geojson'
            });


            const layers = [
                'Below District Median',
                'Slightly Above Median',
                'Wealthy',
                'Very Wealthy',
                'Extremely Wealthy',
            ];

            const colors = [
                '#D2F2D4',
                '#7BE382',
                '#26CC00',
                '#22B600',
                '#009C1A'
            ];

            const legend = document.getElementById('legend');

            layers.forEach((layer, i) => {
                const color = colors[i];
                const item = document.createElement('div');
                const key = document.createElement('span');
                item.className = 'legend-item';
                key.className = 'legend-key';
                key.style.backgroundColor = color;

                const value = document.createElement('span');
                value.innerHTML = `${layer}`;
                item.appendChild(key);
                item.appendChild(value);
                legend.appendChild(item);
            });

            // Adding congressional networth data to the map.
            // This includes the fill color logic for the choropleth map
            // As well as upon hovering, a district turns blue
            map.addLayer({
                'id': 'networth-layer',
                'type': 'fill',
                'source': 'congress-networth',
                'paint': {
                    'fill-color': [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        '#0066ff',
                        [
                            'step',
                            ['get', 'wealth_index'],
                            '#f1eef6', //default color or < first step
                            .00001, '#D2F2D4',
                            10, '#7BE382',
                            50, '#26CC00',
                            100, '#22B600',
                            216, '#009C1A'
                        ]
                    ],
                    'fill-opacity': 0.85,
                    'fill-outline-color': '#ffffff'
                }
            });

            let hoverId = null;

            // 'e' is the event object in MapBox GL JS
            // e.features is an array of GeoJSON features from the layer under the mouse at the moment
            // e.features has a length b/c if 1 or more features are under cursor, length = 1 or more, if you're on the background or outside the layer, its 0
            // we're saying when the mouse moves on the networth layer, if the hover is over a polygon from net worth layer, do the hover effect
            map.on('mousemove', 'networth-layer', (e) => {
                if (e.features.length > 0) {
                    if (hoverId !== null) {
                        map.setFeatureState(
                            { source: 'congress-networth', id: hoverId },
                            { hover: false }
                        );
                    }

                    // e.features[0] is the first feature under the mouse
                    // so here we're going into the hover feature and grabbing its id
                    // that zero index is just a reference to the first feature under the mouse
                    hoverId = e.features[0].id;

                    map.setFeatureState(
                        { source: 'congress-networth', id: hoverId },
                        { hover: true }
                    );
                }
            });

            map.on('mouseleave', 'networth-layer', () => {
                if (hoverId !== null) {
                    map.setFeatureState(
                        { source: 'congress-networth', id: hoverId },
                        { hover: false }
                    );
                }
                hoverId = null;
            })

            let selectedFeature = null;
            map.on('click', 'networth-layer', (e) => {
                const feature = e.features[0];
                if (selectedFeature) {
                    map.setFeatureState(selectedFeature, { selected: false });
                }

                selectedFeature = feature;
                map.setFeatureState(feature, { selected: true });
                showCard(feature);
            }
            );
        });


        //Toggle legend button for small screens/mobile devices:

        const toggleBtn = document.getElementById('toggle-legend-btn');
        const legend = document.getElementById('legend');

        toggleBtn.addEventListener('click', () => {
            legend.classList.toggle('show');
            toggleBtn.textContent = legend.classList.contains('show') ? 'Hide Legend' : 'Show Legend';
        });