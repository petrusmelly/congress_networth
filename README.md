# Congressional Wealth vs. District Income

This interactive map visualizes the estimated **net worth of U.S. House Representatives** compared to the **median household income** of the people in their congressional districts.

**Live Map:** [https://petrusmelly.github.io/congress_networth/](https://petrusmelly.github.io/congress_networth/)

---

## Purpose

This project was inspired by the question:

**Can someone who is 10, 50, or 200 times wealthier than their average constituent truly understand the needs of the people they represent?**

Using public financial disclosures and Census income data, it creates a **Wealth Disparity Index** for each congressional district:

**(Net Worth − Median Income) ÷ Median Income**

The results are shown as a color-coded choropleth map of Illinois districts, allowing users to explore how the wealth of their representative matches up with their median annual income.

---

## Features

- Interactive map using Mapbox GL JS
- Choropleth color scale based on wealth disparity score
- 📋 Click on a district to see:
  - Representative’s name
  - Estimated average net worth
  - District median income
  - Calculated disparity score
- Mobile-responsive layout with collapsible legend

---

## Tech Stack

| Component | Usage |
|----------|-------|
| HTML, CSS, JS | Static site, mobile-responsive layout |
| Mapbox GL JS | Mapping & data visualization |
| GeoJSON | Spatial district + data encoding |
| GitHub Pages | Free public hosting |

---

## Data Sources

- [House of Representatives Financial Disclosures](https://disclosures-clerk.house.gov/FinancialDisclosure)
- [U.S. Census Bureau – ACS Data](https://data.census.gov/)
- Net worth estimated using [OpenSecrets methodology](https://www.opensecrets.org/personal-finances/methodology)

> Net worth was calculated by summing minimum asset values and subtracting maximum liabilities to create a conservative baseline. See full methodology in the project’s "Methodology" section.

---

## About the Creator

This project was created by [Chris Petruccelli](https://github.com/petrusmelly), a former park ranger with a background in geography and public lands who is learning some GIS and programming. Built as a portfolio project to demonstrate skills in:

- Data cleaning and analysis
- Map design and spatial reasoning
- Web development and front-end deployment
