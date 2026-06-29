// --- Bật nhạc nền xuyên suốt ---
document.body.addEventListener('click', () => {
    try {
        if (window.parent && window.parent.document.getElementById('bg-music')) {
            const bgMusic = window.parent.document.getElementById('bg-music');
            if (bgMusic.paused) {
                bgMusic.play().catch(e => console.log("Audio play failed:", e));
            }
        }
    } catch (e) {}
}, { once: true });

// --- Floating Images (Global) ---
function createFloatingImages() {
    const container = document.body;
    
    const imageUrls = [
        "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", 
        "6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg",
        "11.jpg", "12.jpg", "13.jpg", "14.jpg", "15.jpg",
        "16.jpg", "17.jpg", "18.jpg", "19.jpg", "20.jpg",
        "22.jpg", "23.jpg"
    ].map(name => `fig/her/${name}`);
    
    // Dùng trọn bộ 22 ảnh
    const totalImages = 22; 
    const colWidth = 100 / totalImages;

    // Phân bổ đều theo trục ngang (chia 22 cột)
    const cols = Array.from({length: totalImages}, (_, i) => i);
    cols.sort(() => Math.random() - 0.5);

    // Trộn ngẫu nhiên danh sách ảnh
    const shuffledUrls = [...imageUrls].sort(() => Math.random() - 0.5);
    
    // Đặt thời gian bay cố định để dễ chia delay
    const duration = 40; 

    for (let i = 0; i < totalImages; i++) {
        const img = document.createElement('img');
        img.src = shuffledUrls[i];
        img.classList.add('floating-image');
        
        // Kích thước to rõ rệt (130px - 190px)
        const size = Math.random() * 60 + 130; 
        img.style.width = `${size}px`;
        img.style.height = `${size}px`;
        img.style.objectFit = "cover";
        
        // Vị trí ngang: Mỗi ảnh độc chiếm 1 cột, không lo đè nhau ngang
        const colIndex = cols[i];
        img.style.left = `${colIndex * colWidth}vw`; 
        
        // Top mặc định là 0 để CSS translateY tính toán
        img.style.top = "0"; 
        
        img.style.animationDuration = `${duration}s`;
        
        // Phân bổ dọc HOÀN HẢO: chia đều độ trễ.
        img.style.animationDelay = `-${i * (duration / totalImages)}s`;
        
        // Tăng sáng (opacity: 0.4 -> 0.75)
        const opacity = (Math.random() * 0.35 + 0.4).toString();
        img.style.setProperty('--img-opacity', opacity);
        
        container.appendChild(img);
    }
}
createFloatingImages();

// --- Petals Effect (Global) ---
function createPetals() {
    const container = document.body;
    // Tăng vọt lượng hoa rơi theo yêu cầu (45 cánh)
    const totalPetals = 45;

    for (let i = 0; i < totalPetals; i++) {
        const petal = document.createElement('div');
        petal.classList.add('petal');
        
        const size = Math.random() * 10 + 8; 
        petal.style.width = `${size}px`;
        petal.style.height = `${size}px`;
        
        petal.style.left = `${Math.random() * 100}vw`;
        petal.style.top = `${Math.random() * 100}vh`;
        
        const duration = Math.random() * 15 + 10;
        petal.style.animationDuration = `${duration}s`;
        
        petal.style.animationDelay = `-${Math.random() * 15}s`;
        petal.style.opacity = (Math.random() * 0.5 + 0.3).toString();
        
        container.appendChild(petal);
    }
}
createPetals();

// --- Mouse Trail (Global) ---
let lastTrailTime = 0;
document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastTrailTime < 50) return; // Giới hạn số lượng hạt sinh ra
    lastTrailTime = now;

    const trail = document.createElement('div');
    trail.classList.add('mouse-trail');
    trail.innerHTML = '✨';
    trail.style.left = `${e.pageX}px`;
    trail.style.top = `${e.pageY}px`;
    
    document.body.appendChild(trail);
    
    setTimeout(() => {
        trail.remove();
    }, 800);
});

// --- Page Specific Logic ---
document.addEventListener('DOMContentLoaded', () => {

    // --- MÀN 1: start.html ---
    if (document.getElementById('screen-1')) {
        const textElements = document.querySelectorAll('.seq-text');
        const buttonsContainer = document.getElementById('buttons-container');
        const envelopeContainer = document.getElementById('envelope-container');
        const screen1 = document.getElementById('screen-1');
        let currentTextIndex = 0;

        function showNextText() {
            if (currentTextIndex > 0 && currentTextIndex < textElements.length) {
                textElements[currentTextIndex - 1].classList.remove('visible');
            }

            if (currentTextIndex < textElements.length) {
                setTimeout(() => {
                    textElements[currentTextIndex].classList.add('visible');
                    currentTextIndex++;
                    setTimeout(showNextText, 4000); 
                }, 500); 
            } else {
                setTimeout(() => {
                    buttonsContainer.style.opacity = '1';
                    buttonsContainer.style.pointerEvents = 'auto';
                }, 500);
            }
        }
        
        if (envelopeContainer) {
            envelopeContainer.addEventListener('click', () => {
                envelopeContainer.style.transition = "opacity 0.8s, transform 0.8s";
                envelopeContainer.style.opacity = "0";
                envelopeContainer.style.transform = "scale(1.5)";
                
                // Chỉ phát nhạc cục bộ nếu mở trực tiếp start.html (không qua iframe)
                try {
                    if (window === window.parent) {
                        const localAudio = document.getElementById('bg-music');
                        if (localAudio && localAudio.paused) localAudio.play();
                    }
                } catch(e) {}

                setTimeout(() => {
                    envelopeContainer.style.display = "none";
                    screen1.style.display = "flex"; 
                    setTimeout(showNextText, 500); // Bắt đầu chạy text sau khi lá thư biến mất
                }, 800);
            });
        } else {
            setTimeout(showNextText, 500); // Khởi động luôn nếu không có thư
        }

        // Logic Nút Không
        const btnNo = document.getElementById('btn-no');
        const btnYes = document.getElementById('btn-yes');
        let moveCount = 0;
        let yesScale = 1;

        btnNo.addEventListener('mouseover', () => {
            if (moveCount < 10) { 
                const x = Math.random() * (window.innerWidth - btnNo.offsetWidth - 40) - (window.innerWidth/2 - btnNo.offsetWidth/2);
                const y = Math.random() * (window.innerHeight - btnNo.offsetHeight - 40) - (window.innerHeight/2 - btnNo.offsetHeight/2);
                btnNo.style.transform = `translate(${x}px, ${y}px)`;
                moveCount++;
                
                // Phóng to nút Có mỗi khi né
                yesScale += 0.2;
                btnYes.style.transform = `scale(${yesScale})`;
                btnYes.style.transition = 'transform 0.2s';
            } else {
                btnNo.innerText = "Em chắc chưa? 🥺";
            }
        });

        btnNo.addEventListener('click', () => {
            yesScale += 0.5;
            btnYes.style.transform = `scale(${yesScale})`;
            if (moveCount >= 10) {
                alert("Nút này bị hỏng rồi, bấm nút kia đi em! 😂");
            }
        });

        btnYes.addEventListener('click', () => {
            window.location.href = 'survey.html';
        });
    }

    // --- MÀN 2: survey.html ---
    if (document.getElementById('screen-2')) {
        const activityRadios = document.querySelectorAll('input[name="activity"]');
        const movieInputGroup = document.getElementById('movie-input-group');
        const cafeInputGroup = document.getElementById('cafe-input-group');

        activityRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.value === 'Xem phim') {
                    movieInputGroup.style.display = 'block';
                    cafeInputGroup.style.display = 'none';
                } else {
                    movieInputGroup.style.display = 'none';
                    cafeInputGroup.style.display = 'block';
                }
            });
        });

        document.getElementById('btn-next-to-3').addEventListener('click', () => {
            const food = document.querySelector('input[name="food"]:checked').value;
            const activity = document.querySelector('input[name="activity"]:checked').value;
            const orderOption = document.querySelector('input[name="order"]'); 
            const order = orderOption ? document.querySelector('input[name="order"]:checked').value : 'Ăn trước';
            const movieName = document.getElementById('movie-name').value || "Không ghi gì";
            const cafeName = document.getElementById('cafe-name').value || "Không ghi gì";
            const flowerGuess = document.getElementById('flower-guess').value || "Không đoán";
            const lifetimeFood = document.getElementById('lifetime-food').value || "Không chọn";
            const preferencesText = document.getElementById('preferences').value || "Không có dặn dò gì thêm.";

            const surveyData = {
                food, activity, order, movieName, cafeName, flowerGuess, lifetimeFood, preferencesText
            };
            localStorage.setItem('surveyData', JSON.stringify(surveyData));
            
            window.location.href = 'restaurant.html';
        });
    }

    // --- MÀN 3: restaurant.html ---
    if (document.getElementById('screen-restaurant')) {
        document.getElementById('btn-next-to-timeline').addEventListener('click', () => {
            const restOpinion = document.getElementById('restaurant-opinion').value || "Không có ý kiến gì";
            const surveyData = JSON.parse(localStorage.getItem('surveyData')) || {};
            surveyData.restaurantOpinion = restOpinion;
            localStorage.setItem('surveyData', JSON.stringify(surveyData));
            
            window.location.href = 'timeline.html';
        });
    }

    // --- MÀN 4: timeline.html ---
    if (document.getElementById('screen-3')) {
        const surveyData = JSON.parse(localStorage.getItem('surveyData'));
        const timelineContainer = document.getElementById('dynamic-timeline-container');

        if (surveyData) {
            const isEatFirst = surveyData.order === 'Ăn trước';
            const selectedActivity = surveyData.activity;

            // Generate Pickup Event
            let timelineHTML = `
                <div class="timeline-item">
                    <div class="timeline-icon"><i class="fa-solid fa-car"></i></div>
                    <div class="timeline-content">
                        <h3>17:30 - Sang rước công chúa</h3>
                        <p>Anh sẽ qua đón em đúng giờ, nhớ xịt chút nước hoa thơm thơm nhé!</p>
                        <div class="image-placeholder" style="margin-top: 10px;">
                            <img src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=400&q=80" alt="Đón em" style="border-radius:10px; width:100%;">
                        </div>
                    </div>
                </div>
            `;

            const eatEventHTML = `
                <div class="timeline-item">
                    <div class="timeline-icon"><i class="fa-solid fa-utensils"></i></div>
                    <div class="timeline-content">
                        <h3>${isEatFirst ? '18:15' : '20:30'} - Ăn tối lãng mạn tại Domu</h3>
                        <p>Mình sẽ dùng bữa ở không gian cực xinh tại Nguyễn Khắc Cần - Tràng Tiền nhé.</p>
                        <div class="image-placeholder" style="margin-top: 10px;">
                            <img src="fig/res/1.jpg" alt="Ăn tối" style="border-radius:10px; width:100%;">
                        </div>
                    </div>
                </div>
            `;

            let playEventHTML = '';
            const activityTime = isEatFirst ? '20:00' : '18:15';
            
            if (selectedActivity === 'Đi cafe') {
                const cafeName = surveyData.cafeName !== "Không ghi gì" ? surveyData.cafeName : "view đẹp";
                playEventHTML = `
                    <div class="timeline-item" id="dynamic-play-item">
                        <div class="timeline-icon"><i class="fa-solid fa-spinner fa-spin"></i></div>
                        <div class="timeline-content">
                            <h3>Đang tải ảnh quán cafe...</h3>
                        </div>
                    </div>
                `;
                
                const aiImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent("beautiful romantic coffee shop cafe " + cafeName)}?width=800&height=400&nologo=true`;
                const img = new Image();
                img.src = aiImageUrl;
                img.onload = () => {
                    const el = document.getElementById('dynamic-play-item');
                    if(el) {
                        el.innerHTML = `
                            <div class="timeline-icon"><i class="fa-solid fa-mug-hot"></i></div>
                            <div class="timeline-content">
                                <h3>${activityTime} - Đi cafe lượn lờ hóng gió</h3>
                                <p>Chở công chúa đi ngắm phố phường và tâm sự.</p>
                                <div class="image-placeholder">
                                    <img src="${aiImageUrl}" alt="Quán Cafe" style="border-radius:10px; width:100%;">
                                    <p class="image-caption">Quán: ${cafeName} (AI tự vẽ đó nha 😂)</p>
                                </div>
                            </div>
                        `;
                    }
                };
            } else {
                const movieName = surveyData.movieName !== "Không ghi gì" ? surveyData.movieName : "kinh dị";
                playEventHTML = `
                    <div class="timeline-item" id="dynamic-play-item">
                        <div class="timeline-icon"><i class="fa-solid fa-spinner fa-spin"></i></div>
                        <div class="timeline-content">
                            <h3>Đang tải ảnh phim...</h3>
                        </div>
                    </div>
                `;

                const aiImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(movieName + " movie poster")}?width=800&height=400&nologo=true`;
                const img = new Image();
                img.src = aiImageUrl;
                img.onload = () => {
                    const el = document.getElementById('dynamic-play-item');
                    if(el) {
                        el.innerHTML = `
                            <div class="timeline-icon"><i class="fa-solid fa-film"></i></div>
                            <div class="timeline-content">
                                <h3>${activityTime} - Xem phim: ${movieName}</h3>
                                <p>Sợ quá thì nhớ nhắm mắt lại nha!</p>
                                <div class="image-placeholder">
                                    <img src="${aiImageUrl}" alt="Rạp chiếu phim" style="border-radius:10px; width:100%;">
                                    <p class="image-caption">hehee</p>
                                </div>
                            </div>
                        `;
                    }
                };
            }

            // Theo thứ tự
            if (isEatFirst) {
                timelineHTML += eatEventHTML + playEventHTML;
            } else {
                timelineHTML += playEventHTML + eatEventHTML;
            }

            // Generate Dropoff Event
            timelineHTML += `
                <div class="timeline-item">
                    <div class="timeline-icon"><i class="fa-solid fa-house"></i></div>
                    <div class="timeline-content">
                        <h3>23:00 - Chở Bông về dinh</h3>
                        <p>Đảm bảo an toàn, không để mẹ lo đâu nha!</p>
                        <div class="image-placeholder" style="margin-top: 10px;">
                            <img src="fig/665bc6010669dc1592765ebac3de16fb.jpg" alt="Đưa em về" style="border-radius:10px; width:100%;">
                        </div>
                    </div>
                </div>
            `;

            timelineContainer.innerHTML = timelineHTML;
        }

        document.getElementById('btn-submit').addEventListener('click', () => {
            window.location.href = 'success.html';
        });
    }

    // --- MÀN 5: success.html ---
    if (document.getElementById('screen-4')) {
        const surveyData = JSON.parse(localStorage.getItem('surveyData'));

        if (surveyData) {
            // Gen PDF Table
            const isEatFirst = surveyData.order === 'Ăn trước';
            const tbody = document.getElementById('dynamic-pdf-tbody');
            if(tbody) {
                let tbodyHTML = `
                    <tr>
                        <td>17:30</td>
                        <td>Con qua đón em Bông tại nhà.</td>
                    </tr>
                `;

                const eatRow = `
                    <tr>
                        <td>${isEatFirst ? '18:15' : '20:30'}</td>
                        <td>Ăn tối tại quán Domu (Số 7 Nguyễn Khắc Cần - Tràng Tiền).</td>
                    </tr>
                `;

                const playRow = `
                    <tr>
                        <td>${isEatFirst ? '20:00' : '18:15'}</td>
                        <td>Đi dạo / cafe / xem phim.</td>
                    </tr>
                `;

                if (isEatFirst) {
                    tbodyHTML += eatRow + playRow;
                } else {
                    tbodyHTML += playRow + eatRow;
                }

                tbodyHTML += `
                    <tr>
                        <td>23:00</td>
                        <td>Con đưa em Bông về tận cửa nhà an toàn.</td>
                    </tr>
                `;
                tbody.innerHTML = tbodyHTML;
            }

            // Gửi EmailJS
            if (!sessionStorage.getItem('emailSent')) {
                emailjs.init("K-8c_7dC3G5vQ1J2a"); 

                let customDetail = surveyData.activity === "Xem phim" ? `Phim: ${surveyData.movieName}` : `Quán: ${surveyData.cafeName}`;
                const finalMessage = `
1. Lịch trình: ${surveyData.order}
2. Đồ ăn chọn: ${surveyData.food}
3. Cảm nhận về quán ăn: ${surveyData.restaurantOpinion || "Chưa nhận xét"}
4. Lựa chọn đi chơi: ${surveyData.activity} (${customDetail})
5. Hoa mà em ấy đoán: ${surveyData.flowerGuess}
6. Món ăn cả đời: ${surveyData.lifetimeFood}
7. Dặn dò thêm: ${surveyData.preferencesText}
                `.trim();

                emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", { 
                    message: finalMessage,
                    name: "Người thương",
                    email: "crush@hethong.com"
                }).then(() => {
                    sessionStorage.setItem('emailSent', 'true');
                }).catch(err => console.error("Lỗi EmailJS:", err));
            }
        }

        document.getElementById('btn-download').addEventListener('click', () => {
            const element = document.getElementById('pdf-template');
            const rightPanel = document.getElementById('right-panel');
            
            // Hiển thị preview ngay cạnh bên phải
            rightPanel.style.display = 'block';

            const opt = {
                margin: 10,
                filename: 'Don_Xin_Phep_Dua_Don.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            // Tải file xuống nhưng không ẩn đi nữa để làm preview
            html2pdf().set(opt).from(element).save();
        });
    }
});
