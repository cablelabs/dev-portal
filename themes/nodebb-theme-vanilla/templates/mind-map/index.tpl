<!--<!doctype html>-->
<!--<html lang="en">-->
<!--<head>-->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>CIA Entities Map</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css">
    <link href='http://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" type="text/css" href="secured/mind-map/secured/css/app-with-sets.css">
<!--</head>-->

<!--<body>-->

<!--<div id="container-fluid">-->

  <div class="graph-settings" class="row">
    <div class="col-md-4" id="entity-sets">
      <div>
        <label for="sets">Entity Subset</label>
        <button type="button" id="edit-setlist-btn" class="btn btn-link" title="Manage Entity Sets"
                data-toggle="modal" data-target="#set-manager">
          <span class="glyphicon glyphicon-edit"></span>
        </button>
      </div>
      <div>
        <select name="sets" id="sets" class="form-control">
          <option value="all">All Entities</option>
        </select>
      </div>
      <div>
        <button type="button" id="edit-set-btn" class="btn btn-default">
          <span class="glyphicon glyphicon-edit"></span>
        </button>
      </div>
    </div>
    <div class="col-md-4">
      <form role="search" id="search-form">
        <label for="search-field">Entity Search</label>
        <div class="input-group input-group-lg">
          <input type="text" class="form-control" placeholder="Entity Name" id="search-field">
          <span class="input-group-btn">
            <button class="btn btn-default" id="clear-search-btn" type="button">&#x2716;</button>
          </span>
        </div>
      </form>
    </div>
    <div class="hops-away-wrap col-md-4">
      <span>Hops Away </span>
      <div data-hops="1" class="depth-1 hops-away-btn">1</div>
      <div data-hops="2" class="depth-2 hops-away-btn">2</div>
      <div data-hops="3" class="depth-3 hops-away-btn">3</div>
    </div>
  </div>
  <div id="graph"></div>
<!--</div>-->

<!-- Modal -->
<div class="modal fade" id="set-manager" tabindex="-1" role="dialog" aria-labelledby="set-manager" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="myModalLabel">Manage Entity Sets</h4>
      </div>
      <div class="modal-body">
        <div>
          <form role="add" id="add-set-form">
            <div class="input-group input-group-lg">
            <input type="text" class="form-control" placeholder="New Set Name" id="add-set-text">
            <span class="input-group-btn">
              <button class="btn btn-default" id="add-set-btn" type="submit">
                <span class="glyphicon glyphicon-plus"></span>
              </button>
            </span>
          </div>
          </form>
          <ul id="entity-set-sort-list"></ul>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" data-dismiss="modal">Done</button>
      </div>
    </div>
  </div>
</div>

<!--<script src="https://code.jquery.com/jquery-2.1.1.min.js"></script>-->
<script src="secured/mind-map/secured/js/jquery-ui.min.js"></script>
<!--<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js"></script>-->
<script src="secured/mind-map/secured/js/dom-element.js"></script>
<script src="secured/mind-map/secured/js/entity-graph-with-sets.js"></script>
<script src="secured/mind-map/secured/js/app-with-sets.js"></script>

<!--</body>-->
<!--</html>-->