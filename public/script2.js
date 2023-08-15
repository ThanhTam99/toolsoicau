function formatNumber(number) {
    switch (number) {
        case 1:
            return `<span class="circle-blue">${number}</span>`;
        case 2:
            return `<span class="circle-green">${number}</span>`;
        case 3:
            return `<span class="circle-yellow">${number}</span>`;
        case 4:
            return `<span class="circle-orange">${number}</span>`;
        case 5:
            return `<span class="circle-orange">${number}</span>`;
        case 6:
            return `<span class="circle-orange">${number}</span>`;
        case 7:
            return `<span class="circle-orange">${number}</span>`;
        case 8:
            return `<span class="circle-orange">${number}</span>`;
        default:
            return number;
    }
}

function createColumns(arr) {
    let columns = [];
    let currentColumn = [];

    arr.forEach((num) => {
        if (currentColumn.length === 0 ||
            ((num === 1 || num === 3) === (currentColumn[0] === 1 || currentColumn[0] === 3))) {
            currentColumn.push(num);
        } else {
            columns.push(currentColumn);
            currentColumn = [num];
        }
    });

    if (currentColumn.length > 0) {
        columns.push(currentColumn);
    }
    return columns;
}

function updateMangBanDauDisplay(ketQuaMangCon = []) {
    let tablesData = [];

    // Create columns
    ketQuaMangCon.forEach((arr) => {
        let columns = createColumns(arr);

        // Determine the maximum number of rows
        let maxRows = Math.max(...columns.map(subColumn => subColumn.length));

        // Generate table
        let tableData = [];
        for (let i = 0; i < maxRows; i++) {
            let tableRow = [];
            columns.forEach(subColumn => {
                let cellContent = (subColumn[i] !== undefined) ? formatNumber(subColumn[i]) : '';
                tableRow.push('<td>' + cellContent + '</td>');
            });
            tableData.push('<tr>' + tableRow.join('') + '</tr>');
        }
        tablesData.push(`<div class="table-container"><table>${tableData.join('')}</table></div>`);
    });
    document.getElementById('mangBanDauDisplay').innerHTML = tablesData.join('');
}



// Prevent non-digit input and remove all whitespace characters
document.getElementById('addInput').addEventListener('input', function (e) {
    let input = this.value.replace(/\s/g, '');
    this.value = input.replace(/[^0-4]/g, '');
});

document.getElementById('addForm').addEventListener('submit', function (event) {
    event.preventDefault();

    var inputValue = document.getElementById('addInput').value;
    let soColumnValue = document.getElementById('columnNum').value;
    let arrHandle = [];
    if (inputValue === '') {
        alert("Vui lòng nhập danh sách cầu!");
        return;
    }
    if (soColumnValue) {
        console.log("blo");
        let soColumn = parseInt(soColumnValue);
        // Split the input into segments of length soColumn
        let segments = [];
        for (let i = 0; i < inputValue.length; i += soColumn) {
            segments.push(inputValue.slice(i, i + soColumn).split(''));
        }

        // Create the resulting array
        let arrHandles = [];
        for (let i = 0; i < soColumn; i++) {
            let temp = [];
            for (let j = 0; j < segments.length; j++) {
                if (segments[j][i] !== undefined) {
                    temp.push(parseInt(segments[j][i]));
                }
            }
            arrHandles.push(temp);
        }
        arrHandles.forEach(function (arr) {
            arrHandle = arrHandle.concat(arr);
        });
    } else {
        arrHandle = Array.from(inputValue).map(Number);
        if (arrHandle.some(num => num < 0 || num > 4 || isNaN(num))) {
            alert('Vui lòng chỉ nhập số từ 0 đến 4.');
            return;
        }
    }
    $.ajax({
        url: 'http://localhost:3000/addData',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(arrHandle),
        success: function () {
            document.getElementById('addInput').value = '';
            // updateMangBanDauDisplay(); // Comment out this line to prevent the display from updating here
            refreshData(); // <-- Refresh the displayed data after adding
            alert('Thêm danh sách cầu thành công');
        },
        error: function (error) {
            alert('Thêm danh sách cầu không thành công' + error);
        }
    });
});

document.getElementById('resetBtn').addEventListener('click', function (event) {
    $.ajax({
        url: 'http://localhost:3000/resetData',
        method: 'POST',
        success: function () {
            refreshData(); // <-- Refresh the displayed data after reset
            alert('Đã reset mảng ban đầu');
        }
    });
});

document.getElementById('searchInput').addEventListener('input', function (e) {
    let input = this.value.replace(/\s/g, '');
    this.value = input.replace(/[^0-4]/g, '');
});

// code for search form
document.getElementById('searchForm').addEventListener('submit', function (event) {
    event.preventDefault();
    let mangNhapVao = document.getElementById('searchInput').value.split('').map(Number);
    console.log(mangNhapVao);
    let ketQuaMangCon = [];
    let ketQua = [];
    // Fetch the current state of the array
    $.ajax({
        url: 'http://localhost:3000/getData',
        method: 'GET',
        success: function (data) {
            if (data) {
                mangBanDau = data;
                mangBanDau.forEach(mangCon => {
                    let i = 0;
                    while (i < mangCon.length) {
                        if (mangCon.slice(i, i + mangNhapVao.length).toString() === mangNhapVao.toString() && i + mangNhapVao.length < mangCon.length) {
                            ketQuaMangCon.push(mangCon);
                            ketQua.push(mangCon[i + mangNhapVao.length]);
                            break; // break the loop as soon as we find a match
                        }
                        i++;
                    }
                });
                if (mangNhapVao.length === 0) {
                    updateMangBanDauDisplay(ketQuaMangCon);
                    document.getElementById('result').innerHTML = '';
                } else if (ketQua.length > 0) {
                    updateMangBanDauDisplay(ketQuaMangCon);  // Update the display with the search results
                    let formattedResult = ketQua.map(formatNumber).join(' ');
                    document.getElementById('result').innerHTML = formattedResult;
                } else {
                    document.getElementById('mangBanDauDisplay').innerHTML = 'Không tìm thấy kết quả';
                    alert('Không tìm thấy kết quả');
                    document.getElementById('result').innerHTML = '';
                }
            }
        }
    });
});

function isNumberKey(e) {
    var charCode = (e.which) ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}

document.getElementById('resetInputsBtn').addEventListener('click', function (event) {
    // Reset các giá trị input
    document.getElementById('addInput').value = '';
    document.getElementById('searchInput').value = '';
    document.getElementById('columnNum').value = '';
});


// Update the display when the page is first loaded
$.ajax({
    url: 'http://localhost:3000/getData',
    method: 'GET',
    success: function (data) {
        if (data) {
            updateMangBanDauDisplay(data);
        }
    }
});

function refreshData() {
    $.ajax({
        url: 'http://localhost:3000/getData',
        method: 'GET',
        success: function (data) {
            if (data) {
                updateMangBanDauDisplay(data);
            }
        }
    });
}

// ...and finally, refresh the data when the page first loads:
$(document).ready(function() {
    refreshData();
});
