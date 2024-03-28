function previewImage(event) {
    const fileInput = event.target;
    const preview = document.getElementById('preview');
  
    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
  
      reader.onload = function(e) {
        preview.src = e.target.result;
        preview.style.display = "block";
      };
  
      reader.readAsDataURL(fileInput.files[0]);
    }
  }

  