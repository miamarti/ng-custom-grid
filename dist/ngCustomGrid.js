(function () {
    'use strict';
    (angular.module('ngCustomGrid', ['ng'])).directive('ngCustomGrid', [

        function () {

            var PagerFactory = function () {
                this.numberOfRecords = undefined; //Quantidade de registros
                this.amountPerPage = undefined /*5*/ ; //Quantidade de registos por página
                this.numberOfPages = undefined; //Quantidade de páginas
                this.currentPage = 1; //undefined/*1*/; //Página atual
                this.enableNext = undefined; //Habilitar próxima página
                this.enablePrevious = undefined; //Habilitar página anterior
                this.visualList = [];
                this.amountInPage = undefined; // quantidade de registros nesta página
                this.firstItemInPage = undefined; // posição absoluta do primeiro registro na página
                this.lastItemInPage = undefined; // posição absoluta do último registro na página
                this.itemRange = ''; // posição absoluta dos itens na página no formato 'min - max', ou vazio
            };

            PagerFactory.prototype = {

                callback: function () {
                    return (this.externalCallback !== undefined) ? this.externalCallback(this) : '';
                },

                setVisualList: function () {
                    this.enablePrevious = this.currentPage > 1; //!(this.currentPage === 1);
                    this.enableNext = this.currentPage < this.numberOfPages; // !(this.currentPage === this.numberOfPages);
                    var $this = this;

                    if (this.numberOfPages > 3) {
                        if (this.currentPage < 3) {
                            this.visualList = [{
                                value: 1,
                                active: this.currentPage === 1,
                                trigger: function () {
                                    $this.setCurrentPage(this.value);
                                }
                        }, {
                                value: 2,
                                active: this.currentPage === 2,
                                trigger: function () {
                                    $this.setCurrentPage(this.value);
                                }
                        }, {
                                value: 3,
                                active: false,
                                trigger: function () {
                                    $this.setCurrentPage(this.value);
                                }
                        }];
                        } else {
                            if (this.currentPage === this.numberOfPages) {
                                this.visualList = [{
                                    value: this.currentPage - 2,
                                    active: false,
                                    trigger: function () {
                                        $this.setCurrentPage(this.value);
                                    }
                            }, {
                                    value: this.currentPage - 1,
                                    active: false,
                                    trigger: function () {
                                        $this.setCurrentPage(this.value);
                                    }
                            }, {
                                    value: this.currentPage,
                                    active: true,
                                    trigger: function () {
                                        $this.setCurrentPage(this.value);
                                    }
                            }];
                            } else {
                                this.visualList = [{
                                    value: this.currentPage - 1,
                                    active: false,
                                    trigger: function () {
                                        $this.setCurrentPage(this.value);
                                    }
                            }, {
                                    value: this.currentPage,
                                    active: true,
                                    trigger: function () {
                                        $this.setCurrentPage(this.value);
                                    }
                            }, {
                                    value: this.currentPage + 1,
                                    active: false,
                                    trigger: function () {
                                        $this.setCurrentPage(this.value);
                                    }
                            }];
                            }
                        }
                    } else {
                        if (this.numberOfPages === 3) {
                            this.visualList = [{
                                value: 1,
                                active: this.currentPage === 1,
                                trigger: function () {
                                    $this.setCurrentPage(this.value);
                                }
                        }, {
                                value: 2,
                                active: this.currentPage === 2,
                                trigger: function () {
                                    $this.setCurrentPage(this.value);
                                }
                        }, {
                                value: 3,
                                active: this.currentPage === 3,
                                trigger: function () {
                                    $this.setCurrentPage(this.value);
                                }
                        }];
                        } else {
                            if (this.numberOfPages === 2) {
                                this.visualList = [{
                                    value: 1,
                                    active: this.currentPage === 1,
                                    trigger: function () {
                                        $this.setCurrentPage(this.value);
                                    }
                            }, {
                                    value: 2,
                                    active: this.currentPage === 2,
                                    trigger: function () {
                                        $this.setCurrentPage(this.value);
                                    }
                            }];
                            } else {
                                this.visualList = [{
                                    value: 1,
                                    active: true,
                                    trigger: function () {
                                        $this.setCurrentPage(this.value);
                                    }
                            }];
                            }
                        }
                    }
                },

                setNumberOfPages: function () {
                    this.numberOfPages = Math.ceil(this.numberOfRecords / this.amountPerPage);
                },

                getRecompute: function () {
                    this.setNumberOfPages();
                    this.setVisualList();
                    return this;
                },

                getFirstItemInPage: function () {
                    return this.firstItemInPage;
                },

                getLastItemInPage: function () {
                    return this.lastItemInPage;
                },

                getItemRange: function () {
                    return this.itemRange;
                },

                getCurrentPage: function () {
                    return this.currentPage;
                },

                setNumberOfRecords: function (value) {
                    if (this.numberOfRecords !== value) {
                        this.numberOfRecords = value;
                        this.getRecompute();
                        //this.setCurrentPage(1);
                    }
                },

                setAmountPerPage: function (value) {
                    if (this.amountPerPage !== value) {
                        this.amountPerPage = value;
                        this.getRecompute();
                        this.setCurrentPage(1);
                    }
                },

                getAmountPerPage: function () {
                    return this.amountPerPage;
                },

                setCurrentPage: function (value) {
                    this.currentPage = (value > this.numberOfPages) ? this.numberOfPages : ((value < 1) ? 1 : value);
                    this.currentPage = isNaN(this.currentPage) ? 1 : this.currentPage;
                    this.getRecompute();
                    this.callback();
                },

                reloadPage: function () {
                    this.setCurrentPage(this.getCurrentPage());
                },

                /* Realizada em preparação a uma recarga dos dados paginados. Diferente de setCurrentPage(1)
                   e gotoFirst, descarta a contagem anterior de páginas */
                reload: function () {
                    this.currentPage = 1;
                    this.numberOfPages = 1;
                    this.getRecompute();
                    this.callback();
                },

                /* Recarrega a página corrente, considerando que nItems foram removidos; caso necessário,
                   vai para a última página ainda contendo itens */
                reloadPageWithDeletion: function (nItems) {
                    if (this.numberOfPages !== undefined) {} {
                        if (this.numberOfRecords - nItems < this.firstItemInPage) {
                            this.numberOfPages = Math.ceil((this.numberOfRecords - nItems) / this.amountPerPage);
                        }
                        this.setCurrentPage(this.numberOfPages);
                    }
                },

                /* Vai para a primeira página */
                gotoFirst: function () {
                    if (this.numberOfPages !== undefined) {
                        this.setCurrentPage(1);
                    }
                },

                /* Vai para a última página. Se o parâmetro for passado e for true, indica que um item
                   foi inserido; e nesse caso considera se é necessário criar uma página adicional */
                gotoLast: function (forceNext) {
                    if (this.numberOfPages !== undefined) {} {
                        if (arguments.length === 1 && forceNext &&
                            this.amountPerPage > 0 &&
                            this.numberOfRecords > 0 &&
                            this.numberOfRecords % this.amountPerPage === 0) {
                            this.numberOfPages++;
                        }
                        this.setCurrentPage(this.numberOfPages);
                    }
                },

                setCallback: function (callback) {
                    this.externalCallback = callback;
                },

                next: function () {
                    if (this.enableNext && this.currentPage < this.numberOfPages) {
                        this.setCurrentPage(this.currentPage + 1);
                    }
                },

                previous: function () {
                    if (this.enablePrevious && this.currentPage > 1) {
                        this.setCurrentPage(this.currentPage - 1);
                    }
                },

                isLastPage: function () {
                    return (this.currentPage === this.numberOfPages);
                }

            };

            return {
                restrict: 'E',
                template: function (element, attrs) {

                    var getNgPagination = function (ref) {
                        var ngPagination = '';
                        ngPagination += '    <div class="row" ng-show="ngPagination">';
                        if (ref === 1) {
                            ngPagination += '        <div class="col-md-4" ng-show="ngModel.totalElements > 0">';
                            ngPagination += '            <div class="summary-grid" ng-show="ngModel.totalElements > 0">';
                            ngPagination += '                <strong>{{ngModel.totalElements}} <span ng-bind="ngModel.totalElements === 1 ? \'document\' : \'documents\'"></span></strong>';
                            ngPagination += '            </div>';
                            ngPagination += '        </div>';
                        }
                        ngPagination += '        <div class="col-md-2 pull-right filtro-organizar" ng-show="ngModel.totalElements > 0">';
                        ngPagination += '            <div class="form-group">';
                        ngPagination += '                <label translate="default.organizar"></label>';
                        ngPagination += '                <div class="div-select-box">';
                        ngPagination += '                    <select ng-model="ngPagination.sort" ng-change="sortBy()" class="form-control">';
                        ngPagination += '                        <option value="asc">Older</option>';
                        ngPagination += '                        <option value="desc">Most recent</option>';
                        ngPagination += '                    </select>';
                        ngPagination += '                </div>';
                        ngPagination += '            </div>';
                        ngPagination += '        </div>';
                        ngPagination += '        <div class="col-md-2 pull-right filtro-mostrar" ng-show="ngModel.totalElements > 0">';
                        ngPagination += '            <div class="form-group">';
                        ngPagination += '                <label translate="default.mostrar"></label>';
                        ngPagination += '                <div class="div-select-box" >';
                        ngPagination += '                    <select class="form-control" ng-options="item as item for item in ngPagination.range track by item" ng-model="ngPagination.size" ng-change="setAmountPerPage()">';
                        ngPagination += '                    </select>';
                        ngPagination += '                </div>';
                        ngPagination += '            </div>';
                        ngPagination += '        </div>';
                        ngPagination += '        <div class="col-md-4 pull-right filtro-paginacao" ng-show="ngModel.totalElements > 0">';
                        ngPagination += '            <div class="form-group">';
                        ngPagination += '                <label translate="default.paginacao"></label>';
                        ngPagination += '                <ul class="pagination pagination-sm paginacao-primaria">';
                        ngPagination += '                    <li>';
                        ngPagination += '                        <a class="glyphicon glyphicon-chevron-left" style="top: 0px;" ng-click="pager.previous()" ng-class="{\'disabled\': !pager.enablePrevious}"></a>';
                        ngPagination += '                    </li>';
                        ngPagination += '                    <li ng-repeat="n in pager.visualList" ng-class="{active: n.active}" ng-click="n.trigger()">';
                        ngPagination += '                        <a>{{n.value}}</a>';
                        ngPagination += '                    </li>';
                        ngPagination += '                    <li>';
                        ngPagination += '                        <a class="glyphicon glyphicon-chevron-right" style="top: 0px;" ng-click="pager.next()" ng-class="{\'disabled\': !pager.enableNext}"></a>';
                        ngPagination += '                    </li>';
                        ngPagination += '                </ul>';
                        ngPagination += '            </div>';
                        ngPagination += '        </div>';
                        ngPagination += '    </div>';
                        return ngPagination;
                    };

                    var html = '';
                    html += '<div ng-show="ngModel.content.length > 0">';
                    html += getNgPagination(2);
                    html += '    <div class="table-responsive" ng-show="ngModel.content.length > 0">';
                    html += '        <table class="table table-hover tabela-estilo-primario">';
                    html += '            <thead>';
                    html += '                <tr>';
                    html += '                    <th ng-repeat="$header in headerList">{{$header}}</th>';
                    html += '                </tr>';
                    html += '            </thead>';
                    html += '            <tbody>';
                    html += '                <tr ng-repeat="$obj in ngModel.content" ng-include="ngTemplate" ng-click="ngTrigger($obj)">';
                    html += '                </tr>';
                    html += '            </tbody>';
                    html += '        </table>';
                    html += '    </div>';
                    html += getNgPagination(1);
                    html += '</div>';

                    html += '<div ng-show="ngModel.content.length === 0">';
                    html += '    <p>No results found.</span></p>';
                    html += '</div>';

                    return html;
                },
                scope: {
                    ngModel: '=ngModel',
                    ngHeader: '=ngHeader',
                    ngTrigger: '=ngTrigger',
                    ngPagination: '=ngPagination',
                    ngSizeList: '=ngSizeList',
                    ngLabel: '=ngLabel',
                    ngTemplate: '=ngTemplate'
                },
                require: 'ngModel',
                link: function (scope, element, attrs, ctrl) {

                    scope.pager = new PagerFactory();

                    scope.callbackRun = function () {
                        scope.ngPagination.index = parseInt(scope.pager.currentPage);
                        scope.ngPagination.size = parseInt(scope.pager.amountPerPage);
                        scope.ngPagination.callback(scope.ngPagination);
                    };

                    scope.setAmountPerPage = function () {
                        console.log(this.ngPagination.size);
                        scope.pager.setAmountPerPage(scope.ngPagination.size);
                    };

                    scope.sortBy = function () {
                        scope.pager.reload();
                    };

                    scope.$watch('ngModel', function (value) {
                        if (value) {
                            if (scope.ngModel.totalElements) {
                                scope.pager.setNumberOfRecords(scope.ngModel.totalElements);
                            }
                            if (scope.ngPagination && scope.ngPagination.size) {
                                scope.pager.setAmountPerPage(scope.ngPagination.size);
                            }
                            if (scope.callbackRun) {
                                scope.pager.setCallback(scope.callbackRun);
                            }
                        }
                    });

                    scope.$watch('ngHeader', function (value) {
                        if (value) {
                            scope.headerList = [];
                            if (value.length === undefined) {
                                for (var key in scope.ngHeader) {
                                    scope.headerList.push(scope.ngHeader[key]);
                                }
                            } else {
                                scope.headerList = value;
                            }
                        }
                    });
                }
            };
        }
    ]);
})(window, document);
