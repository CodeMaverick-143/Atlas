# Atlas - Interactive World Map Explorer

Atlas is a modern web application that provides detailed information about countries around the world. It features an interactive map interface and comprehensive country details including political, economic, cultural, and geographic information.

## 🌟 Features

### Interactive Map
- Interactive world map interface
- Click on countries to view detailed information
- Smooth transitions and animations
- Responsive design for all devices

### Country Details
- **Political Information**
  - Capital city
  - Government type
  - Head of state
  - Population statistics

- **Economic Information**
  - GDP data
  - Currency information
  - Exchange rates
  - Main industries (dynamically fetched from Wikipedia)

- **Cultural Information**
  - Official languages
  - Cultural traditions (dynamically fetched from Wikipedia)
  - Cultural heritage

- **Geographic Information**
  - Region and subregion
  - Area
  - Climate
  - Geographic coordinates
  - Bordering countries
  - Current weather in capital city

### Real-time Data
- Live weather data from Open-Meteo API
- Current exchange rates
- Wikipedia integration for cultural information
- REST Countries API for country data

## 🛠️ Technologies Used

- React
- TypeScript
- Tailwind CSS
- Framer Motion (for animations)
- React Query (for data fetching)
- Axios (for API requests)
- React Router (for navigation)

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/atlas.git
```

2. Install dependencies:
```bash
cd atlas
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_API_KEY=your_api_key_here
```

## 🌐 API Integration

The application integrates with several APIs:
- REST Countries API
- Open-Meteo API (for weather data)
- Wikipedia API (for cultural information)
- Exchange Rate API

## 🎨 UI/UX Features

- Modern glassmorphism design
- Dark/Light mode support
- Responsive layout
- Smooth animations and transitions
- Interactive elements
- Loading states and error handling

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [REST Countries API](https://restcountries.com/)
- [Open-Meteo API](https://open-meteo.com/)
- [Wikipedia API](https://www.mediawiki.org/wiki/API:Main_page)
- [Exchange Rate API](https://www.exchangerate-api.com/)

## 📞 Support

For support, email support@example.com or create an issue in the repository. 