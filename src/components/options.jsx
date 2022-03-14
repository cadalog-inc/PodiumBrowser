import React from 'react';
import { Button, Dropdown, Navbar, NavbarBrand } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlusSquare, faAngleLeft, faAngleRight, faClipboardCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import { AddItems } from './admin/AddItems';
import { EditCategory } from './admin/EditCategory';

export class Options extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageSizes: [
                25, 50, 100, 200, 400, 1000
            ],
            sortBys: [
                'File Name (A to Z)',
                'File Name (Z to A)',
                'File Size (High to Low)',
                'File Size (Low to High)',
                'Date Uploaded (New to Old)',
                'Date Uploaded (Old to New)'
            ],
            showEditCategory: false,
            showAddItems: false
        }
    }


    render() {
        return this.props.upper ? (
            <React.Fragment>
                {
                    window.admin ?
                        <React.Fragment>
                            <EditCategory
                                show={this.state.showEditCategory}
                                category={this.props.category}
                                categories={this.props.categories}
                                items={this.props.items}
                                handleClose={(e) => {
                                    this.setState({
                                        showEditCategory: false
                                    })
                                }}
                            />
                            <AddItems
                                show={this.state.showAddItems}
                                category={this.props.category}
                                categories={this.props.categories}
                                items={this.props.items}
                                handleClose={(e) => {
                                    this.setState({
                                        showAddItems: false
                                    })
                                }}
                            />
                        </React.Fragment>
                        : null
                }
                <Navbar expand="lg" bg="light">
                    <NavbarBrand>
                        {this.props.category.title} {
                            window.admin ?
                                <React.Fragment>
                                    <FontAwesomeIcon
                                        onClick={(e) => {
                                            this.setState({ showEditCategory: true })
                                        }}
                                        icon={faEdit}
                                        title="Edit Category"
                                    />
                                    {
                                        !this.props.isHomeCategory(this.props.category) && !this.props.isPrimaryCategory(this.props.category) &&  this.props.itemsLength === 0 ?
                                        (
                                            <React.Fragment>
                                                <FontAwesomeIcon
                                                    style={{ marginLeft: 5 }}
                                                    onClick={(e) => {
                                                        if (window.confirm("Are you sure you want to REMOVE this category?")) {
                                                            const category = this.props.category;
                                                            var params = {
                                                                TableName: "Categories",
                                                                Item: category,
                                                                Key: {
                                                                    id: category.id
                                                                }
                                                            };
                                                            const options = this;
                                                            window.docClient.delete(params, function (err, data) {
                                                                if (err) {
                                                                    console.log(err);
                                                                } else {
                                                                    const index = options.props.categories.indexOf(category);
                                                                    options.props.categories.splice(index, 1);
                                                                    options.handleNavigateToParentCategory(category.parentId);
                                                                }
                                                            });
                                                        }
                                                    }}
                                                    icon={faTrash}
                                                    title="Remove Category"
                                                    color="violet"
                                                />
                                            </React.Fragment>
                                        ) : null
                                    }
                                    {
                                        this.props.category.id === 1 ? null :
                                            (
                                                <React.Fragment>
                                                    <FontAwesomeIcon
                                                        style={{ marginLeft: 5 }}
                                                        onClick={(e) => {
                                                            this.setState({ showAddItems: true })
                                                        }}
                                                        icon={faPlusSquare}
                                                        title="Add Items"
                                                        color="orange"
                                                    />
                                                </React.Fragment>
                                            )
                                    }
                                    {
                                        !this.props.isHomeCategory(this.props.category) && this.props.itemsLength === 0 ?
                                            (
                                                <React.Fragment>
                                                    <FontAwesomeIcon
                                                        style={{ marginLeft: 5 }}
                                                        onClick={(e) => {
                                                            var title = prompt("Enter title of new sub category");
                                                            if (title !== null && title !== "") {
                                                                const category = {
                                                                    id: Number(new Date()) + this.props.categories.length,
                                                                    title: title,
                                                                    parentId: this.props.query.categoryId,
                                                                    primaryIndex: -1
                                                                }
                                                                const options = this;
                                                                var params = {
                                                                    TableName: "Categories",
                                                                    Item: category
                                                                };
                                                                window.docClient.put(params, function (err, data) {
                                                                    if (err) {
                                                                        console.log(err);
                                                                    } else {
                                                                        console.log(data);
                                                                        options.props.categories.push(category);
                                                                        options.props.updateFromOptions();
                                                                    }
                                                                });
                                                            }
                                                        }}
                                                        icon={faPlusSquare}
                                                        title="Add Sub Category"
                                                        color="teal"
                                                    />
                                                </React.Fragment>
                                            ) : null
                                    }
                                    <FontAwesomeIcon
                                        style={{ marginLeft: 5 }}
                                        onClick={(e) => {
                                            if (window.confirm(`Are you certain you want to select all items in ${this.props.category.title}?`)) {
                                                this.props.selectAllItemsInCategory();
                                            }
                                        }}
                                        icon={faClipboardCheck}
                                        title={`Select All Items In ${this.props.category.title}`}
                                    />
                                </React.Fragment>
                                : null}
                    </NavbarBrand>
                    <Navbar.Text>
                        {this.props.itemsLength > 0 ? this.props.itemsBegin + 1 : 0} - {this.props.itemsEnd <= this.props.itemsLength ? this.props.itemsEnd : this.props.itemsLength} of {this.props.itemsLength}
                    </Navbar.Text>
                    <Navbar.Toggle aria-controls="options-navbar-nav" />
                    <Navbar.Collapse className="justify-content-end" id="options-navbar-nav" >
                        <Dropdown size="sm" style={{ margin: 5 }}>
                            <Dropdown.Toggle variant="light">
                                Per page: {this.props.query.pageSize}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {
                                    this.state.pageSizes.map((pageSize, index) => {
                                        return (
                                            <Dropdown.Item key={index} onClick={() => {
                                                this.handlePageSizeClick(pageSize)
                                            }}>
                                                {pageSize}
                                            </Dropdown.Item>
                                        );
                                    })
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown size="sm" style={{ margin: 5 }}>
                            <Dropdown.Toggle variant="light">
                                Sort by: {this.props.query.sortBy}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {
                                    this.state.sortBys.map((sortBy, index) => {
                                        return (
                                            <Dropdown.Item key={index} onClick={() => {
                                                this.handleSortByClick(sortBy)
                                            }}>
                                                {sortBy}
                                            </Dropdown.Item>
                                        );
                                    })
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                        {
                            this.props.category.id === this.props.getMyFavoritesCategoryId() ?
                                (
                                    <Button type="button" variant="light" style={{ margin: 5 }}
                                        onClick={(e) => {
                                            this.props.handleClearFavoritesClick();
                                        }}>
                                        Clear My Favorites
                                    </Button>
                                )
                                : null
                        }
                    </Navbar.Collapse>
                </Navbar>
            </React.Fragment>
        ) : (
                <React.Fragment>
                    <Navbar bg="light" style={{
                        justifyContent: 'center'
                    }}>
                        <Button type="button" variant="light" style={{ margin: 5 }}
                            onClick={() => this.handlePageIndexClick(this.props.pageBack)}>
                            <FontAwesomeIcon icon={faAngleLeft} color="darkgrey" />
                        </Button>
                        <Navbar.Text>
                            {this.props.itemsLength > 0 ? this.props.itemsBegin + 1 : 0} - {this.props.itemsEnd <= this.props.itemsLength ? this.props.itemsEnd : this.props.itemsLength} of {this.props.itemsLength}
                        </Navbar.Text>
                        <Button type="button" variant="light" style={{ margin: 5 }}
                            onClick={() => this.handlePageIndexClick(this.props.pageNext)}>
                            <FontAwesomeIcon icon={faAngleRight} color="darkgrey" />
                        </Button>
                    </Navbar>
                </React.Fragment>
            );
    }

    handlePageSizeClick = (pageSize) => {
        this.props.history.push(`/?categoryId=${this.props.query.categoryId}&searchTerm=${this.props.query.searchTerm}&pageIndex=0&pageSize=${pageSize}&onlyFree=${this.props.query.onlyFree}&onlyRecent=${this.props.query.onlyRecent}&sortBy=${this.props.query.sortBy}`);
        window.scrollTo(0, 0);
    }

    handleSortByClick = (sortBy) => {
        this.props.history.push(`/?categoryId=${this.props.query.categoryId}&searchTerm=${this.props.query.searchTerm}&pageIndex=0&pageSize=${this.props.query.pageSize}&onlyFree=${this.props.query.onlyFree}&onlyRecent=${this.props.query.onlyRecent}&sortBy=${sortBy}`);
        window.scrollTo(0, 0);
    }

    handlePageIndexClick = (pageIndex) => {
        this.props.history.push(`/?categoryId=${this.props.query.categoryId}&searchTerm=${this.props.query.searchTerm}&pageIndex=${pageIndex}&pageSize=${this.props.query.pageSize}&onlyFree=${this.props.query.onlyFree}&onlyRecent=${this.props.query.onlyRecent}&sortBy=${this.props.query.sortBy}`);
        window.scrollTo(0, 0);
    }

    // admin
    handleNavigateToParentCategory = (categoryId) => {
        this.props.history.push(`/?categoryId=${categoryId}&searchTerm=${this.props.query.searchTerm}&pageIndex=0&pageSize=${this.props.query.pageSize}&onlyFree=${this.props.query.onlyFree}&onlyRecent=${this.props.query.onlyRecent}&sortBy=${this.props.query.sortBy}`);
        window.scrollTo(0, 0);
    }
}