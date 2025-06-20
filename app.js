const uploadForm = document.getElementById('uploadForm');
const fileList = document.getElementById('fileList');

// Handle file upload
uploadForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  if (!file) {
    alert('Please select a file to upload.');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      alert('File uploaded successfully!');
      listFiles();
    } else {
      alert('File upload failed.');
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    alert('An error occurred.');
  }
});

// Fetch and display the list of files
async function listFiles() {
  try {
    const response = await fetch('/files');
    const files = await response.json();

    fileList.innerHTML = '';
    files.forEach((file) => {
      const listItem = document.createElement('li');
      listItem.textContent = file.name;
      fileList.appendChild(listItem);
    });
  } catch (error) {
    console.error('Error fetching file list:', error);
    alert('Could not load files.');
  }
}

// Initial fetch of files
listFiles();
