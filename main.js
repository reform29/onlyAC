 // Slideshow Logic
        const slides = document.querySelectorAll('.slide');
        let currentSlideIndex = 0;

        function showNextSlide() {
            slides[currentSlideIndex].classList.remove('active');
            currentSlideIndex = (currentSlideIndex + 1) % slides.length;
            slides[currentSlideIndex].classList.add('active');
        }

        setInterval(showNextSlide, 3000);

        // Mobile Menu Toggle
        const menuToggle = document.getElementById('menu-toggle');
        const mainNav = document.getElementById('main-nav');

        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });

        // Service Navigation
        // Service Navigation
        const serviceButtons = document.querySelectorAll('.grid-container button');

        serviceButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetId = button.getAttribute('data-target');
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    // Get the middle box element
                    const middleBox = document.querySelector('.middle-box');

                    // Calculate the offset to scroll to the target section
                    const offset = targetSection.offsetTop - middleBox.offsetTop;

                    // Scroll to the target section within the middle box
                    middleBox.scrollTo({
                        top: offset,
                        behavior: 'smooth'
                    });

                    // Scroll the main page to the top of the middle box
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const middleBoxPosition = middleBox.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                    window.scrollTo({
                        top: middleBoxPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Cart Logic
        let cart = [];

        function addToCart(name, qty, price) {
            const existingItem = cart.find(item => item.name === name);

            if (existingItem) {
                existingItem.qty += qty;
            } else {
                cart.push({ name, qty, price });
            }

            updateCartDisplay();
            showAddedToCartMessage();
        }

        function updateQuantity(index, change) {
            if (cart[index].qty + change > 0) {
                cart[index].qty += change;
                updateCartDisplay();
            }
        }

        function removeItem(index) {
            cart.splice(index, 1);
            updateCartDisplay();
        }

        function clearCart() {
            cart = [];
            updateCartDisplay();
        }

        function updateCartDisplay() {
            // Update desktop cart
            const cartList = document.getElementById('cart-items-list');
            const cartTotal = document.getElementById('cart-total');

            // Update mobile cart
            const mobileCartItems = document.getElementById('mobile-cart-items');
            const mobileCartTotal = document.getElementById('mobile-cart-total');
            const mobileCartCount = document.getElementById('mobile-cart-count');


            // Generate cart HTML
            let cartHTML = '';
            let mobileCartHTML = '';

            cart.forEach((item, index) => {
                // Desktop cart item
                cartHTML += `
                    <div class="cart-item">
                        <div class="cart-item-details">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">₹${item.price} × ${item.qty}</div>
                        </div>
                        <div class="cart-item-controls">
                            <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
                            <span>${item.qty}</span>
                            <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
                            <button class="remove-btn" onclick="removeItem(${index})">×</button>
                        </div>
                    </div>
                `;

                // Mobile cart item
                mobileCartHTML += `
                    <div class="mobile-cart-item">
                        <div class="mobile-cart-item-details">
                            <div class="mobile-cart-item-name">${item.name}</div>
                            <div class="mobile-cart-item-price">₹${item.price} × ${item.qty}</div>
                        </div>
                        <div class="mobile-cart-item-controls">
                            <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
                            <span>${item.qty}</span>
                            <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
                            <button class="remove-btn" onclick="removeItem(${index})">×</button>
                        </div>
                    </div>
                `;
            });


            // Update cart content
            cartList.innerHTML = cartHTML;
            mobileCartItems.innerHTML = mobileCartHTML;

            // Calculate total
            const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

            // Update totals
            cartTotal.textContent = `Total: ₹${total}`;
            mobileCartTotal.textContent = `Total: ₹${total}`;

            // Update cart count badge
            const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
            mobileCartCount.textContent = itemCount;

            // Update WhatsApp button state
            const whatsappButton = document.getElementById('whatsapp-button');
            const mobileWhatsappButton = document.getElementById('mobile-whatsapp-button');

            [whatsappButton, mobileWhatsappButton].forEach(button => {
                button.disabled = cart.length === 0;
                button.style.opacity = cart.length === 0 ? '0.6' : '1';
            });
        }

        function showAddedToCartMessage() {
            const messageElement = document.getElementById('added-to-cart-message');
            messageElement.style.display = 'block';

            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 2000);
        }

        // Mobile Cart Logic
        const mobileCartButton = document.getElementById('mobile-cart-button');
        const mobileCartPanel = document.getElementById('mobile-cart-panel');
        const mobileCartClose = document.getElementById('mobile-cart-close');
        const mobileOverlay = document.getElementById('mobile-overlay');

        function toggleMobileCart() {
            mobileCartPanel.classList.toggle('active');
            mobileOverlay.classList.toggle('active');

            if (mobileCartPanel.classList.contains('active')) {
                mobileOverlay.style.display = 'block';
                document.body.style.overflow = 'hidden';
            } else {
                setTimeout(() => {
                    mobileOverlay.style.display = 'none';
                }, 300);
                document.body.style.overflow = '';
            }
        }

        mobileCartButton.addEventListener('click', toggleMobileCart);
        mobileCartClose.addEventListener('click', toggleMobileCart);
        mobileOverlay.addEventListener('click', toggleMobileCart);

        // WhatsApp Form - FIXED: Properly displaying selected services
        const whatsappButton = document.getElementById('whatsapp-button');
        const mobileWhatsappButton = document.getElementById('mobile-whatsapp-button');
        const whatsappForm = document.getElementById('whatsapp-form');
        const overlay = document.getElementById('overlay');
        const closeBtn = document.getElementById('close-btn');
        const sendWhatsappBtn = document.getElementById('send-whatsapp-btn');

        function sendToWhatsApp() {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }

            // Get the services textarea
            const servicesTextarea = document.querySelector('#whatsapp-form textarea[name="services"]');

            // Generate the services text
            let servicesText = "Selected Services:\n";

            // Add each service
            cart.forEach(item => {
                servicesText += `${item.name} × ${item.qty} - ₹${item.price * item.qty}\n`;
            });

            // Set the formatted text to the textarea
            servicesTextarea.value = servicesText;

            // Show the form and overlay
            whatsappForm.classList.add('show');
            overlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        }

        function closeWhatsAppForm() {
            whatsappForm.classList.remove('show');
            overlay.classList.remove('show');
            document.body.style.overflow = '';
        }

        whatsappButton.addEventListener('click', sendToWhatsApp);
        mobileWhatsappButton.addEventListener('click', sendToWhatsApp);

        closeBtn.addEventListener('click', closeWhatsAppForm);

        overlay.addEventListener('click', closeWhatsAppForm);

        sendWhatsappBtn.addEventListener('click', () => {
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email').value;
            const address = document.getElementById('address').value;
            const services = document.querySelector('#whatsapp-form textarea[name="services"]').value;

            if (!name || !phone || !address) {
                alert('Please fill in all required fields');
                return;
            }

            const message = `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nAddress: ${address}\n\n${services}`;
            const whatsappUrl = `https://wa.me/916363758384?text=${encodeURIComponent(message)}`;

            window.open(whatsappUrl, '_blank');
            closeWhatsAppForm();
        });

        // Initialize cart display
        updateCartDisplay();

        document.addEventListener('contextmenu', event => {
            event.preventDefault(); // Prevent the default context menu from appearing
        });