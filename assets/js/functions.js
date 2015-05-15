---
---

var openRow;

$( 'input' ).click(function(event) {
  if (this.value === "") {
    this.value = this.placeholder;
  }
}); 

$( 'input' ).keydown(function(event) {
  if (event.which === 13 || event.which === 9) {
      this.placeholder = this.value;
      toggleRow(openRow);
  }

  if (this.value === "") {
    this.value = this.placeholder;
  }
});

$( document ).click(function(event) {
  var target = event.target;
  var index = target.id.indexOf("-toggle");
  if (target.type !== 'checkbox' && index >= 0) {
    toggleOrg(target, index);

    return;
  }

  if (target.type === 'checkbox' && index >= 0) {
    if (openRow !== undefined) {
      toggleRow(openRow);
    }

    return;
  }

  index = target.id.indexOf("-url");
  if (index >= 0) {
    showUrl(target, index);
  }
});

function showUrl(target, index) {
  var orgName = target.id.substring(0, index);
  var orgRow = $("li." + orgName + "-row");
  toggleRow(orgRow);
}

function toggleRow(row) {
  var height = row.css('height');
  if (height !== '102px') { 
    row.css({ height: '102px' });
    if (openRow !== undefined) {
      toggleRow(openRow);
    }

    openRow = row;
  } else {
    row.css({ height: '56px' });
    saveUrl(row);
    openRow = undefined;
  }
}

function saveUrl(row) {
  var classAttr   = row.attr('class');
  var index       = classAttr.indexOf('-row');
  var orgName     = classAttr.substring(0, index);
  var input       = $("#" + orgName + "-input");

  if (input.val() !== '') {
    var tile = $(".bookmark-tile." + orgName);
    tile.attr('href', input.val());

    // Save
    var orgData = simpleStorage.get("LocalData");
    orgData[orgName].url = input.val();
    var success = simpleStorage.set("LocalData", orgData);
    console.log("Url Success: " +  success);

    input.val('');
  }
}

function toggleOrg(target, index) {
  var orgName = target.id.substring(0, index);

  var tile = $(".bookmark-tile." + orgName)
  var btn = $("#" + target.id);
  if (tile.css('display') != 'none') {
    tile.css({ display: "none" });

    btn.css({
      color: '#27ae60',
      transform: "rotate(225deg)"
    });
  } else {
    tile.css({ display: "block" });

    btn.css({
      color: '#e74c3c',
      transform: "rotate(0deg)"
    });
  }

  // Store Locally
  var orgData = simpleStorage.get("LocalData");

  orgData[orgName].hidden = tile.css('display') === 'none';

  var success = simpleStorage.set("LocalData", orgData);
  console.log("Success: " +  success);
}

$( document ).ready(function() {
  //simpleStorage.flush();
  var orgData = simpleStorage.get("LocalData");
  if (orgData === undefined) {
    orgData = {};
    {% for org in site.data.orgs %}
      orgData.{{ org.name | downcase }} = {
        url:    "{{ org.url }}",
        hidden: false
      };
    {% endfor %}

    var success = simpleStorage.set("LocalData", orgData);
    console.log("Initial Storage Succes: " +  success);
  }

  for (var name in orgData) {
    var hidden  = orgData[name].hidden;
    var input   = $("#" + name + "-input");
    var tile    = $(".bookmark-tile." + name)
    var btn     = $("#" + name + "-toggle");
    var url     = orgData[name].url;

    input.attr('placeholder', orgData[name].url);
    tile.attr('href', url);

    if (hidden === true) {
      tile.css({ display: "none" });
      btn.css({
        color: '#27ae60',
        transform: "rotate(225deg)"
      });
    }
  }
});
