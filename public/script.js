function loadTableData(){
  
    fetch('/list')
  
     //fetch("vehicle_data.json")
    .then(function(response){
     return response.json();
  })
  
  .then(function(products){
     let placeholder = document.querySelector("#data-output");
     let out = "";
     for(let product of products){
        out += `
           <tr>
           <td>${product.model_year}</td>
           <td>${product.make}</td>
           <td>${product.model}</td>
           <td>${product.rejection_percentage}</td>
           <td>${product.reason_1}</td>
           <td>${product.reason_2}</td>
           <td>${product.reason_3}</td>
           </tr>
        `;
        //console.log(out);
     } 
     placeholder.innerHTML = out;
  });
  }
  
  
  function dynamicCellSearch() {
      var input, filter, table, tr, td, i, txtValue;
      input = document.getElementById("myInput");
      filter = input.value.toUpperCase();
      table = document.getElementById("myTable");
      tr = table.getElementsByTagName("tr");
      
      for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[1];
        if (td) {
          txtValue = td.textContent || td.innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
        }       
      }
    }
  