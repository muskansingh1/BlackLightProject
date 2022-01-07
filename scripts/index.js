d3.csv("../assets/MyCSV.csv", (data)=>{
  showTable(data)
});

function showTable(data){
  console.log(data);
  for(let i=0;i<data.length;i++){
      var x=document.getElementsByClassName('table')[0].insertRow();
      var j = 0
      for(let [key, value] of Object.entries(data[i])){
          var cell = x.insertCell(j);
          j++;
          cell.innerHTML = value;

      }
  }    
  getPagination('#table-id');
  SortTables('#table-id',data)
}

function SortTables(table,data){
    $('#MaxColumns').on('change', function(evt){
      var selected = $('#MaxColumns').val();
      var sortedObjs = _.sortBy( data, selected );
      console.log(sortedObjs)
      showTableAfterSort(sortedObjs)
    })
}

function showTableAfterSort(data){
  for(let i=0;i<data.length;i++){
    var x=document.getElementsByClassName('table')[0].deleteRow(1);
  } 

  showTable(data);
}

function getPagination(table) {
    var lastPage = 1;
  
    $('#maxRows')
      .on('change', function(evt) {
  
       lastPage = 1;
        $('.pagination')
          .find('li')
          .slice(1, -1)
          .remove();
        var trnum = 0;
        var maxRows = parseInt($(this).val());
  
        if (maxRows == 5000) {
          $('.pagination').hide();
        } else {
          $('.pagination').show();
        }
  
        var totalRows = $(table + ' tbody tr').length;
        $(table + ' tr:gt(0)').each(function() {
          trnum++;
          if (trnum > maxRows) {
  
            $(this).hide();
          }
          if (trnum <= maxRows) {
            $(this).show();
          }
        });
        if (totalRows > maxRows) {
          var pagenum = Math.ceil(totalRows / maxRows);
          for (var i = 1; i <= pagenum; ) {
            $('.pagination #prev')
              .before(
                '<li data-page="' +
                  i +
                  '">\
                                    <span>' +
                  i++ +
                  '<span class="sr-only">(current)</span></span>\
                                  </li>'
              )
              .show();
          }
        } 
        $('.pagination [data-page="1"]').addClass('active');
        $('.pagination li').on('click', function(evt) {
          evt.stopImmediatePropagation();
          evt.preventDefault();
          var pageNum = $(this).attr('data-page');
  
          var maxRows = parseInt($('#maxRows').val());
  
          if (pageNum == 'prev') {
            if (lastPage == 1) {
              return;
            }
            pageNum = --lastPage;
          }
          if (pageNum == 'next') {
            if (lastPage == $('.pagination li').length - 2) {
              return;
            }
            pageNum = ++lastPage;
          }
  
          lastPage = pageNum;
          var trIndex = 0;
          $('.pagination li').removeClass('active');
          $('.pagination [data-page="' + lastPage + '"]').addClass('active');
            limitPagging();
          $(table + ' tr:gt(0)').each(function() {
            trIndex++;
            if (
              trIndex > maxRows * pageNum ||
              trIndex <= maxRows * pageNum - maxRows
            ) {
              $(this).hide();
            } else {
              $(this).show();
            } 
          });
        });
        limitPagging();
      })
      .val(5)
      .change();
  }

  function limitPagging(){

	if($('.pagination li').length > 7 ){
			if( $('.pagination li.active').attr('data-page') <= 3 ){
			$('.pagination li:gt(5)').hide();
			$('.pagination li:lt(5)').show();
			$('.pagination [data-page="next"]').show();
		}if ($('.pagination li.active').attr('data-page') > 3){
			$('.pagination li:gt(0)').hide();
			$('.pagination [data-page="next"]').show();
			for( let i = ( parseInt($('.pagination li.active').attr('data-page'))  -2 )  ; i <= ( parseInt($('.pagination li.active').attr('data-page'))  + 2 ) ; i++ ){
				$('.pagination [data-page="'+i+'"]').show();

			}

		}
	}
}

$('table.table-sortable th').on('click', function(e) {
  sortTableByColumn(this)
})

function sortTableByColumn(tableHeader) {
  // extract all the relevant details
  let table = tableHeader.closest('table')
  let index = tableHeader.cellIndex
  let sortType = tableHeader.dataset.sortType
  let sortDirection = tableHeader.dataset.sortDir || 'asc' // default sort to ascending

  // sort the table rows
  let items = Array.prototype.slice.call(table.rows);
  let sortFunction = getSortFunction(sortType, index, sortDirection)
  let sorted = items.sort(sortFunction)

  // remove and re-add rows to table
  
  for (let row of sorted) {
    let parent = row.parentNode
    if(row.rowIndex != 0){
      let detatchedItem = parent.removeChild(row)
      parent.appendChild(row)
    }
  }

  // reset heading values and styles
  for (let header of tableHeader.parentNode.children) {
    header.classList.remove('currently-sorted')
    delete header.dataset.sortDir
  }

  // update this headers's values and styles
  tableHeader.dataset.sortDir = sortDirection == 'asc' ? 'desc' : 'asc'
  tableHeader.classList.add('currently-sorted')
}

function getSortFunction(sortType, index, sortDirection) {
  let dir = sortDirection == 'asc' ? -1 : 1
  switch (sortType) {
    case 'text': return stringRowComparer(index, dir);
    case 'numeric': return numericRowComparer(index, dir);
    default: return stringRowComparer(index, dir);
  }
}

// asc = alphanumeric order - eg 0->9->a->z
// desc = reverse alphanumeric order - eg z->a->9->0
function stringRowComparer(index, direction) {
  return (a, b) => -1 * direction * a.children[index].textContent.localeCompare(b.children[index].textContent)
}

// asc = higest to lowest - eg 999->0
// desc = lowest to highest - eg 0->999
function numericRowComparer(index, direction) {
  return (a, b) => direction * (Number(a.children[index].textContent) - Number(b.children[index].textContent))
}
