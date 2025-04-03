document.addEventListener("DOMContentLoaded", function () {
    let currentPage = 1;
    let rowsPerPage = 6;

    function paginateTable() {
        let tbody = document.getElementById("tableBody");
        let rows = tbody.getElementsByTagName("tr");
        let pagination = document.getElementById("pagination");
        let totalPages = Math.ceil(rows.length / rowsPerPage);
        
        pagination.innerHTML = "";

        if (totalPages <= 1) {
            pagination.style.display = "none";
            return;
        } else {
            pagination.style.display = "block";
        }

        for (let i = 0; i < rows.length; i++) {
            rows[i].style.display = "none";
        }

        let start = (currentPage - 1) * rowsPerPage;
        let end = start + rowsPerPage;
        for (let i = start; i < end && i < rows.length; i++) {
            rows[i].style.display = "table-row";
        }

        let paginationList = document.createElement("ul");
        paginationList.className = "pagination justify-content-end";
        
        function createPageButton(label, isDisabled, onClick, isActive = false) {
            let li = document.createElement("li");
            li.className = `page-item ${isDisabled ? 'disabled' : ''} ${isActive ? 'active' : ''}`;
            let btn = document.createElement("a");
            btn.className = "page-link";
            btn.style.borderRadius = "8px"; // Add border radius
            btn.innerText = label;
            btn.href = "#";
            btn.onclick = function (event) {
                event.preventDefault();
                if (!isDisabled) {
                    onClick();
                }
            };
            li.appendChild(btn);
            paginationList.appendChild(li);
        }

        createPageButton("<<", currentPage === 1, function () {
            currentPage--;
            paginateTable();
        });

        for (let i = 1; i <= totalPages; i++) {
            createPageButton(i, false, function () {
                currentPage = i;
                paginateTable();
            }, currentPage === i);
        }

        createPageButton(">>", currentPage === totalPages, function () {
            currentPage++;
            paginateTable();
        });

        pagination.appendChild(paginationList);
    }



    
    function filterTable() {
        let input = document.getElementById("searchInput");
        let filter = input.value.toUpperCase();
        let tbody = document.getElementById("tableBody");
        let tr = tbody.getElementsByTagName("tr");
        let rowCount = 0;
        
        for (let i = 0; i < tr.length; i++) {
            let td = tr[i].getElementsByTagName("td");
            let rowMatches = false;
            for (let j = 0; j < td.length; j++) {
                if (td[j]) {
                    let textValue = td[j].textContent || td[j].innerText;
                    if (textValue.toUpperCase().indexOf(filter) > -1) {
                        rowMatches = true;
                        break;
                    }
                }
            }
            
            tr[i].style.display = rowMatches ? "table-row" : "none";
            if (rowMatches) rowCount++;
        }
        
        if (filter === "") {
            paginateTable();
            currentPage = 1;
        }
    }

    document.getElementById("searchInput").addEventListener("input", function () {
        if (this.value === "") {
            currentPage = 1;
            paginateTable();
        }
        filterTable();
    });

    paginateTable();
});