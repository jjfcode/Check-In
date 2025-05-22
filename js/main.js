let currentClassName = '';

function showAttendeeForm() {
    currentClassName = document.getElementById('className').value.trim();
    if (!currentClassName) {
        alert('Please enter a class name');
        return;
    }

    // Show class name and attendee form
    document.getElementById('classNameSection').style.display = 'none';
    document.getElementById('displayClassName').style.display = 'block';
    document.getElementById('currentClassName').textContent = `Current Class: ${currentClassName}`;
    document.getElementById('checkInForm').style.display = 'block';
}

function saveToCSV(data) {
    // Get current date for the filename
    const now = new Date();
    const date = now.toISOString().split('T')[0];    // Create row content with correct order matching headers
    const row = [
        `"${now.toLocaleDateString()}"`,
        `"${now.toLocaleTimeString()}"`,
        `"${data.className}"`,
        `"${data.fullName}"`,
        `"${data.companyName}"`,
        `"${data.email}"`,
        `"${data.phone}"`,
        `"${data.futureInterest ? 'Yes' : 'No'}"`
    ].join(',');// Get existing data from localStorage
    let existingData = localStorage.getItem(`checkins_${currentClassName}`);
    const headers = ['"Date"', '"Time"', '"Class Name"', '"Full Name"', '"Company Name"', '"Email"', '"Phone"', '"Interested in Future Classes"'].join(',');
    
    // If no existing data, create new with headers
    if (!existingData) {
        existingData = headers;
    }

    // Add new row to existing data
    const csvContent = existingData + '\n' + row;    // Save updated data to localStorage
    localStorage.setItem(`checkins_${currentClassName}`, csvContent);

    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const filename = `class-checkin_${currentClassName}_${date}.csv`;
    
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Add event listener when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('checkInForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Collect form data in the correct order to match headers
            const formData = {
                className: currentClassName,
                fullName: document.getElementById('fullName').value,
                companyName: document.getElementById('companyName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                futureInterest: document.getElementById('futureInterest').checked
            };

        // Save the data
        saveToCSV(formData);

        // Reset the form and show success message
        this.reset();
        alert('Check-in successful! The data has been saved to a CSV file.');
    });
});
