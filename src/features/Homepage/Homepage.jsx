import React, { useEffect } from 'react';
import './Homepage.css';
import Header from '@components/Header/Header';
import Slider from 'react-slick';
import image1 from '@images/Red.png';
import image2 from '@images/Blue.png';
import image3 from '@images/Green.png';

function Homepage() {

    const settings = {
        dots: true,  // Hiển thị dấu chấm điều hướng
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,  // Tự động chạy slide
        autoplaySpeed: 3000,  // Chuyển slide sau 3 giây
    };

    const features = [
        { title: "LOCOMOTION AND MANIPULATION", content: "Nội dung chi tiết về tính năng này..." },
        { title: "ENERGY EFFICIENT", content: "Nội dung chi tiết về tính năng này..." },
        { title: "SCALABILITY AND FLEXIBILITY", content: "Nội dung chi tiết về tính năng này..." },
        { title: "ROBOT HUMAN - COLLABRATION", content: "Nội dung chi tiết về tính năng này..." },
        { title: "CONNECTTVITY AND INTERGRATION", content: "Nội dung chi tiết về tính năng này..." },
        { title: "SENSING AND PERCEPTION", content: "Nội dung chi tiết về tính năng này..." },
        // Thêm các mục khác tương tự
      ];

      const FeatureItem = ({ feature }) => (
        <div className="feature-item">
          <div className="feature-title">
            <span>{feature.title}</span>
          </div>
          <div className="feature-content">
            <p>{feature.content}</p>
          </div>
        </div>
      );

    useEffect(() => {
        const handleScroll = (event) => {
            event.preventDefault();
            const scrollAmount = window.innerHeight;
            if (event.deltaY > 0) {
                window.scrollBy({ top: scrollAmount, behavior: 'smooth' });
            } else {
                window.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
            }
        };

        window.addEventListener('wheel', handleScroll);

        return () => {
            window.removeEventListener('wheel', handleScroll);
        };
    }, []);
    
  return (
    <div className="homepage-container">
      <Header />
      <div className="homepage-content1">
        <div className="hero-section">
          <h1>REVOLUTIONIZE ROBOT SOLUTION FOR INDUSTRIAL</h1>
        </div>
        <Slider {...settings}>
            <div>
                <img src={image1} alt="Red color representation" className="slider-img" />
            </div>
            <div>
                <img src={image2} alt="Blue color representation" className="slider-img" />
            </div>
            <div>
                <img src={image3} alt="Green color representation" className="slider-img" />
            </div>
        </Slider>
        <div className="homepage-content2">
            <div className="features-container">
                {/* Column 1 */}
                <div className="feature-column">
                    {features.slice(0, 3).map((feature, index) => (
                    <FeatureItem key={index} feature={feature} />
                    ))}
                </div>
                
                {/* Column 2 */}
                <div className="feature-column">
                    {features.slice(3, 6).map((feature, index) => (
                    <FeatureItem key={index + 3} feature={feature} />
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;