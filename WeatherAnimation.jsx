function WeatherAnimation({ icon }) {
    switch (icon) {

        // Clear sky (day)
        case "01d":
            return (
                <div className="animation-container">
                    <div className="sun"></div>
                </div>
            );

        // Clear sky (night)
        case "01n":
            return (
                <div className="animation-container">
                    <div className="moon"></div>

                    {Array.from({ length: 40 }).map((_, i) => (
                        <div
                            key={i}
                            className="star"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 60}%`,
                                animationDelay: `${Math.random() * 3}s`,
                            }}
                        ></div>
                    ))}
                </div>
            );

        // Clouds
        case "02d":
        case "02n":
        case "03d":
        case "03n":
        case "04d":
        case "04n":
            return (
                <div className="animation-container">
                    <div className="cloud cloud1"></div>
                    <div className="cloud cloud2"></div>
                    <div className="cloud cloud3"></div>
                </div>
            );

        // Rain
        case "09d":
        case "09n":
        case "10d":
        case "10n":
            return (
                <div className="animation-container rain">
                    {Array.from({ length: 40 }).map((_, i) => (
                        <span key={i}></span>
                    ))}
                </div>
            );
        case "11d":
        case "11n":
            return (
                <div className="animation-container rain thunder">
                    {Array.from({ length: 40 }).map((_, i) => (
                        <span key={i}></span>
                    ))}
                </div>
            );

        // Snow
        case "13d":
        case "13n":
            return (
                <div className="animation-container snow">
                    {Array.from({ length: 30 }).map((_, i) => (
                        <span key={i}></span>
                    ))}
                </div>
            );
        case "50d":
        case "50n":
            return (
                <div className="animation-container">
                    <div className="fog"></div>
                </div>
            );

        default:
            return null;
    }
}

export default WeatherAnimation;