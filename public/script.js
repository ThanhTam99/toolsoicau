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

function updateMangBanDauDisplay() {
    $.ajax({
        url: 'http://localhost:3000/getData',
        method: 'GET',
        success: function (data) {
            let tablesData = [];

            // Create columns
            data.forEach((arr) => {
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
    });
}

function formatNumber(number) {
    switch (number) {
        case 0:
            return `<span class="circle-white">${number}</span>`;
        case 1:
            return `<span class="circle-blue">${number}</span>`;
        case 2:
            return `<span class="circle-green">${number}</span>`;
        case 3:
            return `<span class="circle-yellow">${number}</span>`;
        case 4:
            return `<span class="circle-orange">${number}</span>`;
        default:
            return number;
    }
}

// Prevent non-digit input and remove all whitespace characters
document.getElementById('addInput').addEventListener('input', function(e) {
    let input = this.value.replace(/\s/g, '');
    this.value = input.replace(/[^0-4]/g, '');
});

document.getElementById('addForm').addEventListener('submit', function (event) {
    event.preventDefault();
    let mangMoi = Array.from(document.getElementById('addInput').value).map(Number);
    if (mangMoi.some(num => num < 0 || num > 4 || isNaN(num))) {
        alert('Vui lòng chỉ nhập số từ 0 đến 4.');
        return;
    }
    $.ajax({
        url: 'http://localhost:3000/addData',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(mangMoi),
        success: function () {
            document.getElementById('addInput').value = '';
            updateMangBanDauDisplay();
            // alert('Thêm mảng thành công');
        }
    });
});


document.getElementById('resetBtn').addEventListener('click', function (event) {
    $.ajax({
        url: 'http://localhost:3000/resetData',
        method: 'POST',
        success: function () {
            updateMangBanDauDisplay();
            alert('Đã reset mảng ban đầu');
        }
    });
});

document.getElementById('searchInput').addEventListener('input', function(e) {
    let input = this.value.replace(/\s/g, '');
    this.value = input.replace(/[^0-4]/g, '');
});

// code for search form
document.getElementById('searchForm').addEventListener('submit', function (event) {
    event.preventDefault();
    let mangNhapVao = document.getElementById('searchInput').value.split('').map(Number);
    let ketQua = [];
    // Fetch the current state of the array
    $.ajax({
        url: 'http://localhost:3000/getData',
        method: 'GET',
        success: function (data) {
            mangBanDau = data;
            mangBanDau.forEach(mangCon => {
                let i = 0;
                console.log(mangCon);
                while (i < mangCon.length) {
                    if (mangCon.slice(i, i + mangNhapVao.length).toString() === mangNhapVao.toString() && i + mangNhapVao.length < mangCon.length) {
                        ketQua.push(mangCon[i + mangNhapVao.length]);
                        break; // break the loop as soon as we find a match
                    }
                    i++;
                }
            });
            if (ketQua.length > 0) {
                // Format each result before displaying it
                let formattedResult = ketQua.map(formatNumber).join(' ');
                document.getElementById('result').innerHTML = formattedResult;
                // alert('Tìm kiếm thành công');
            } else {
                document.getElementById('result').textContent = 'Không tìm thấy kết quả';
                alert('Không tìm thấy kết quả');
            }
        }
    });
});

// Update the display when the page is first loaded
updateMangBanDauDisplay();




