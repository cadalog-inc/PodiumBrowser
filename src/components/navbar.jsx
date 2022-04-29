import React from 'react';
import axios from 'axios';
import { Button, ButtonGroup, FormControl, InputGroup, Modal, Navbar, NavItem, Col, Row, OverlayTrigger, Container } from 'react-bootstrap';
import Autocomplete from 'react-autocomplete';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faArrowLeft, faArrowRight, faHome, faSearch, faUserCog, faSync, faTimes, faQuestion, faFileExport, faCut, faCopy, faEraser, faTrash, faPaste } from '@fortawesome/free-solid-svg-icons';
import License from '../models/License';
import Query from '../models/Query';
import { LicenseManager } from './LicenseManager';

export class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCategoryId: this.props.getHomeCategory(),
            query: new Query(),
            searchTerm: "",
            showLicenseManager: this.props.standalone && this.props.license.days() <= 30 ? true : false,
            cachingData: false
        }
        this.search = "";
    }

    componentDidMount() {
        // use most recent query values persisted in local storage
        const savedQueryValues = localStorage.getItem("PodiumBrowserStandaloneQueryValues") || "";
        if (savedQueryValues !== "") {

            const query = Query.fromQueryString(savedQueryValues);
            query.searchTerm = "";
            this.props.history.push(`/${query.searchTerm}`);
        }

        this.search = this.props.location.search;

        const query = Query.fromQueryString(this.props.location.search);
        this.setState({
            query: query,
            searchTerm: query.searchTerm
        });
    }

    componentDidUpdate(nextProps) {
        if (this.search !== this.props.location.search) {
            this.search = this.props.location.search;

            // persist latest query values in local storage
            localStorage.setItem("PodiumBrowserStandaloneQueryValues", this.props.location.search);

            const query = Query.fromQueryString(this.props.location.search);
            this.setState({
                query: query,
                searchTerm: query.searchTerm
            });
        }
    }

    getDropdownTranslateX = (index) => {
        if (index >= 0 && index < 7) {
            return 0;
        } else if (index >= 7 && index < 13) {
            return 200;
        } else if (index >= 13 && index < 19) {
            return 400;
        } else {
            return 600;
        }
    }

    getDropdownTranslateY = (index) => {
        if (index >= 0 && index < 7) {
            return 0;
        } else if (index >= 7 && index < 13) {
            return -180;
        } else if (index >= 13 && index < 19) {
            return -360;
        } else {
            return -540;
        }
    }

    render() {
        let primaryCategories = this.props.getSubCategories(this.props.getHomeCategory());
        const suggestions = this.state.searchTerm === "" ? [] : this.findSuggestions(this.state.searchTerm);
        return this.props.items.length > 0 ? (
            <React.Fragment>
                <Navbar fill="true" fixed="top" expand="md" bg="dark" variant="dark" style={{ zIndex: 1 }}>
                    <NavItem>
                        <Button type="button" variant="dark" onClick={() => { this.handleBackClick() }}>
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </Button>
                        <Button type="button" variant="dark" onClick={() => { this.handleNextClick() }}>
                            <FontAwesomeIcon icon={faArrowRight} />
                        </Button>
                        <Button type="button" variant="dark" onClick={() => { this.handleCategoryChange(this.props.getHomeCategory()) }}>
                            <FontAwesomeIcon icon={faHome} />
                        </Button>
                        {
                            this.props.standalone ? (
                                <Button type="button" variant="dark" onClick={() => { this.setState({ showLicenseManager: true }) }}>
                                    {
                                        License.isValid(this.props.license) ?
                                            <FontAwesomeIcon icon={faUserCog} color={"gold"} /> :
                                            <FontAwesomeIcon icon={faUserCog} color={"grey"} />
                                    }
                                </Button>
                            ) : null
                        }
                        {
                            window.admin ? (
                                <React.Fragment>
                                    <Button type="button" variant="dark" onClick={() => {
                                        if (window.confirm("Are you certain you want to cache the data?")) {
                                            this.setState({
                                                cachingData: true
                                            }, () => {
                                                axios.post('https://v4.pdm-plants-textures.com/cache.php', {
                                                    categories: this.props.categories,
                                                    items: this.props.items,
                                                    relationships: this.props.relationships
                                                })
                                                    .then((response) => {
                                                        this.setState({
                                                            cachingData: false
                                                        }, () => {
                                                            if (response.status === 200) {
                                                                window.alert("Data successfully cached!");
                                                            } else {
                                                                window.alert("ERROR: data did not cache successfully.");
                                                            }
                                                        });
                                                    })
                                                    .catch((error) => {
                                                        this.setState({
                                                            cachingData: false
                                                        }, () => {
                                                            window.alert(JSON.stringify(error));
                                                        });
                                                    });
                                            })
                                        }
                                    }}>
                                        <FontAwesomeIcon icon={faFileExport} color={this.state.cachingData ? "gold" : "white"} />
                                    </Button>
                                    <Button type="button" variant="dark" onClick={() => {
                                        this.props.history.push(`/admin`);
                                        window.scrollTo(0, 0);
                                    }}>
                                        <FontAwesomeIcon icon={faCog} color={"white"} />
                                    </Button>
                                    <Button type="button" variant="dark" title="Clear Selected Items" onClick={() => {
                                        if (window.confirm("Are you sure you want to CLEAR the selected items?")) {
                                            this.clearSelectedItems();
                                        }
                                    }}>
                                        {
                                            this.props.selectedItems.length > 0 ?
                                                <FontAwesomeIcon icon={faEraser} color={"gold"} /> :
                                                <FontAwesomeIcon icon={faEraser} color={"darkgrey"} />
                                        }
                                    </Button>
                                    {/* <Button type="button" variant="dark" title="Cut/Paste Selected Items" onClick={() => {
                                        if (window.confirm("Are you sure you want to CUT/PASTE the selected items to this category?")) {
                                            this.cutPasteSelectedItems();
                                        }
                                    }}>
                                        {
                                            this.props.selectedItems.length > 0 ?
                                                <FontAwesomeIcon icon={faCut} color={"gold"} /> :
                                                <FontAwesomeIcon icon={faCut} color={"darkgrey"} />
                                        }
                                    </Button> */}
                                    <Button type="button" variant="dark" title="Copy/Paste Selected Items" onClick={() => {
                                        if (window.confirm("Are you sure you want to COPY/PASTE the selected items to this category?")) {
                                            this.copyPasteSelectedItems();
                                        }
                                    }}>
                                        {
                                            this.props.selectedItems.length > 0 ?
                                                <FontAwesomeIcon icon={faCopy} color={"gold"} /> :
                                                <FontAwesomeIcon icon={faCopy} color={"darkgrey"} />
                                        }
                                    </Button>
                                    <Button type="button" variant="dark" title="Remove Selected Items" onClick={() => {
                                        if (window.confirm("Are you sure you want to REMOVE the selected items from this category?")) {
                                            this.removeSelectedItems();
                                        }
                                    }}>
                                        {
                                            this.props.selectedItems.length > 0 ?
                                                <FontAwesomeIcon icon={faTrash} color={"violet"} /> :
                                                <FontAwesomeIcon icon={faTrash} color={"darkgrey"} />
                                        }
                                    </Button>
                                </React.Fragment>
                            ) : null
                        }
                    </NavItem>
                    <Navbar.Toggle aria-controls="top-navbar-nav" />
                    <Navbar.Collapse className="justify-content-center" id="top-navbar-nav">
                        {
                            window.admin ? null :
                                <NavItem>
                                    <OverlayTrigger
                                        trigger="click"
                                        rootClose
                                        key={'bottom'}
                                        placement={'bottom'}
                                        overlay={
                                            <Container style={{
                                                zIndex: 2,
                                                marginTop: "10px",
                                                backgroundColor: '#fff',
                                                border: '1px solid #343a4055',
                                                borderRadius: 10,
                                                boxShadow: "2px 2px 14px #343a4055",
                                                padding: 20,
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "center",
                                                alignItems: "center"
                                            }}>
                                                <Row>
                                                    {
                                                        primaryCategories.map((category, index) => {
                                                            return (this.props.useHDR || category.title !== 'HDR') ? (
                                                                <Col lg={3} md={4} key={index}>
                                                                    <span
                                                                        style={{ cursor: 'pointer' }}
                                                                        onClick={
                                                                            () => {
                                                                                this.handleCategoryChange(category.id)
                                                                            }
                                                                        }
                                                                    >
                                                                        {category.title}
                                                                    </span>
                                                                </Col>
                                                            ) : null
                                                        })
                                                    }
                                                </Row>
                                            </Container>
                                        }
                                    >
                                        <Button variant="dark">
                                            Categories
                                </Button>
                                    </OverlayTrigger>
                                </NavItem>
                        }
                        <NavItem>
                            <Autocomplete
                                getItemValue={(item) => item.label}
                                items={suggestions}
                                renderItem={(item, isHighlighted) =>
                                    <Container style={{ cursor: 'pointer', background: isHighlighted ? 'lightgray' : 'white' }}>
                                        {item.label}
                                    </Container>
                                }
                                renderInput={(props) => {
                                    return (
                                        <InputGroup>
                                            <FormControl
                                                type="text"
                                                variant="light"
                                                style={{ width: 400 }}
                                                onKeyUp={this.handleOnSearchKey}
                                                onChange={(e) => {
                                                    this.handleSearchTermChange(e.target.value);
                                                }}
                                                {...props}
                                            />
                                            <InputGroup.Append>
                                                <Button
                                                    type="button"
                                                    variant="light"
                                                    style={{
                                                        marginLeft: 0,
                                                        borderTopRightRadius: 5,
                                                        borderBottomRightRadius: 5
                                                    }}
                                                    onClick={() => {
                                                        this.handleSearchTermChange('', this.handleOnSearchClick)
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faTimes} />
                                                </Button>
                                                <Button type="button" variant="dark" onClick={this.handleOnSearchClick}>
                                                    <FontAwesomeIcon icon={faSearch} />
                                                </Button>
                                            </InputGroup.Append>
                                        </InputGroup >
                                    )
                                }}
                                value={this.state.searchTerm}
                                onChange={(e) => this.handleSearchTermChange(e.target.value)}
                                onSelect={(value) => this.handleSearchTermChange(value, this.handleOnSearchClick)}
                            />
                        </NavItem>
                        {
                            window.admin ? null :
                                <Button type="button" variant="dark" onClick={(e) => {
                                    window.open("http://podiumbrowser.com/");
                                }}>
                                    podiumbrowser.com
                            </Button>
                        }
                    </Navbar.Collapse>
                </Navbar>
                <Modal
                    show={this.state.showLicenseManager}
                    onHide={() => this.setState({ showLicenseManager: false })}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header style={{
                        backgroundColor: '#343a40',
                        color: '#fff'
                    }}>
                        <Modal.Title>License Manager</Modal.Title>
                        <ButtonGroup>
                            <Button type="button" variant="dark" onClick={() => this.setState({ showLicenseManager: false })}>
                                <FontAwesomeIcon icon={faTimes} color="white" />
                            </Button>
                        </ButtonGroup>
                    </Modal.Header>
                    <Modal.Body>
                        <LicenseManager license={this.props.license} handleUpdateLicense={this.props.handleUpdateLicense} />
                    </Modal.Body>
                </Modal>
            </React.Fragment>
        ) : null;
    }

    handleBackClick = () => {
        this.props.history.goBack();
    }

    handleNextClick = () => {
        this.props.history.goForward();
    }

    handleCategoryChange = (value) => {
        this.setState({
            selectedCategoryId: value
        }, () => {
            this.props.history.push(`/?categoryId=${this.state.selectedCategoryId}&searchTerm=${this.state.query.searchTerm}&pageIndex=0&pageSize=${this.state.query.pageSize}&onlyFree=${this.state.query.onlyFree}&onlyRecent=${this.state.query.onlyRecent}&sortBy=${this.state.query.sortBy}`);
            window.scrollTo(0, 0);
        });
    }

    handleSearchTermChange = (value, callback = () => { }) => {
        this.setState({
            searchTerm: value
        }, callback);
    }

    handleOnSearchKey = (e) => {
        // User pressed the enter key
        if (e.keyCode === 13) {
            this.handleOnSearchClick();
            e.target.blur();
        }
    }

    handleOnSearchClick = () => {
        this.props.history.push(`/?categoryId=${this.state.query.categoryId}&searchTerm=${this.state.searchTerm}&pageIndex=0&pageSize=${this.state.query.pageSize}&onlyFree=${this.state.query.onlyFree}&onlyRecent=${this.state.query.onlyRecent}&sortBy=${this.state.query.sortBy}`);
        window.scrollTo(0, 0);
    }

    searchTags = (tags, value) => {
        const l = tags.length;
        for (let i = 0; i < l; i++) {
            const tag = tags[i];
            if (tag.includes(value)) {
                return tag;
            }
        }
        return false;
    }

    findSuggestions = (searchTerm) => {
        const suggestions = [];
        const l = this.props.items.length;
        for (let i = 0; i < l; i++) {
            const item = this.props.items[i];
            const result = this.searchTags(item.tags, searchTerm);
            if (result && !suggestions.includes(result)) {
                suggestions.push(result);
            }
        }

        const final = Array.from(new Set(suggestions)).sort().slice(0, 10).map((item) => {
            return { label: item }
        });

        return final;
    }

    // admin
    clearSelectedItems = () => {
        this.props.updateSelectedAction();
        this.props.clearSelectedItems();
    }

    cutPasteSelectedItems = () => {
        const l = this.props.selectedItems.length;
        if (l > 0) {
            const category = this.props.categories.find((c) => c.id === this.state.query.categoryId);
            if (category && category !== undefined) {
                const selectedItem = this.props.selectedItems[0];
                if (selectedItem.category !== category) {
                    let relationship = this.props.relationships.find((r) => r.itemId === selectedItem.item.id && r.categoryId === selectedItem.category.id);
                    const index = this.props.relationships.indexOf(relationship);
                    if (relationship && relationship !== undefined) {
                        relationship.categoryId = category.id;
                        let params = {
                            TableName: "Relationships",
                            Item: relationship,
                            Key: {
                                id: relationship.id
                            },
                            UpdateExpression: "set categoryId=:categoryId",
                            ExpressionAttributeValues: {
                                ":categoryId": relationship.categoryId
                            },
                            ReturnValues: "UPDATED_NEW"
                        };
                        const navbar = this;
                        window.docClient.update(params, function (err, data) {
                            if (err) {
                                console.log(err);
                            } else {
                                navbar.props.relationships[index] = relationship;
                                navbar.props.selectedItems.splice(0, 1);
                                navbar.cutPasteSelectedItems();
                            }
                        });
                    }
                }
            }
        } else {
            this.clearSelectedItems();
        }
    }

    copyPasteSelectedItems = () => {
        const l = this.props.selectedItems.length;
        if (l > 0) {
            const category = this.props.categories.find((c) => c.id === this.state.query.categoryId);
            if (category && category !== undefined) {
                const selectedItem = this.props.selectedItems[0];
                if (selectedItem.category !== category) {
                    let id = Number(new Date());
                    const relationship = {
                        id: id,
                        categoryId: category.id,
                        itemId: selectedItem.item.id
                    };
                    var params = {
                        TableName: "Relationships",
                        Item: relationship
                    };
                    const navbar = this;
                    window.docClient.put(params, function (err, data) {
                        if (err) {
                            console.log(err);
                        } else {
                            navbar.props.relationships.push(relationship);
                            navbar.props.selectedItems.splice(0, 1);
                            navbar.copyPasteSelectedItems();
                        }
                    });
                }
            }
        } else {
            this.clearSelectedItems();
        }
    }

    removeSelectedItems = () => {
        const l = this.props.selectedItems.length;
        if(l > 0) {
            const selectedItem = this.props.selectedItems[0];
            const relationship = this.props.relationships.find((r) => r.itemId === selectedItem.item.id && r.categoryId === selectedItem.category.id);
            if (relationship && relationship !== undefined) {
                var params = {
                    TableName: "Relationships",
                    Item: relationship,
                    Key: {
                        id: relationship.id
                    }
                };
                const navbar = this;
                window.docClient.delete(params, function (err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        const index = navbar.props.relationships.indexOf(relationship);
                        navbar.props.relationships.splice(index, 1);
                        navbar.props.selectedItems.splice(0, 1);
                        navbar.removeSelectedItems();
                    }
                });
            }
        } else {
            this.clearSelectedItems();
        }
    }
}