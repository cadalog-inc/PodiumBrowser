import React from 'react';
import { ListGroup } from 'react-bootstrap';

export class SideBar extends React.Component {
    render() {
        const queryValues = this.props.parseQueryString(this.props.location.search);
        let categoryId = 1;
        if (queryValues.categoryId && queryValues.categoryId !== "" && queryValues.categoryId > 0) {
            categoryId = queryValues.categoryId;
        }
        let categories = this.props.getSubCategories(categoryId);
        if (categoryId === 1) {
            categories = categories.filter((category) => {
                return category.id === 14 || category.id === 21 || category.id === 24 || category.id === 8 || category.id === 217 || category.id === 218;
            });
        }
        const selectedCategory = this.props.categories.find((category) => {
            return category.id === categoryId
        });
        if (categories.length === 0) {

            categories.push(selectedCategory);
        }
        const primaryCategories = this.props.getSubCategories(1);
        return (
            <React.Fragment>
                <ul>
                    {
                        this.renderPath(this.props.calculatePathToCategory(categoryId), 0, categories)
                    }
                </ul>
                <hr />
                <table>
                    <thead>
                        <th>Categories</th>
                    </thead>
                    <tbody>
                        {
                            primaryCategories.map((category, index) => {
                                return category.title !== 'HDR' ? (
                                    <tr key={index} onClick={
                                        () => {
                                            this.handleCategoryChange(category.id)
                                        }
                                    }>
                                        <td>
                                            {category.title}
                                        </td>
                                    </tr>
                                ) : null
                            })
                        }
                    </tbody>
                </table>
            </React.Fragment>
        );
    }

    handleCategoryChange = (value) => {
        this.props.history.push(`/?categoryId=${value}&searchTerm=&pageIndex=0&pageSize=5`);
    }

    renderPath = (path, index, categories) => {
        const category = path[index];
        return category ? index < path.length - 1 ? (
            <li>
                <span onClick={() => this.handleCategoryChange(category.id)}>
                    {category.title}
                </span>
                <ul>
                    {this.renderPath(path, index + 1, categories)}
                </ul>
            </li>
        ) : (
                <li>
                    <span onClick={() => this.handleCategoryChange(category.id)}>
                        {category.title}
                    </span>
                    <ul>
                        {
                            categories.length > 1 ? (
                                categories.map((item, index) => {
                                    return item.title !== 'HDR' ? (
                                        <li key={index}>
                                            <span onClick={() => this.handleCategoryChange(item.id)}>
                                                {item.title}
                                            </span>
                                        </li>
                                    ) : null
                                })
                            ) : null
                        }
                    </ul>
                </li>
            ) : null
    }
}