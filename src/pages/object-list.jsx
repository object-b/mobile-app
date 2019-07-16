import React from 'react';
import {
    Page,
    Navbar,
} from 'framework7-react';

export default class extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Page name="form">
                <Navbar title="Список объектов"></Navbar>

                1Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio quis inventore reprehenderit veritatis, repellat eligendi nemo id provident veniam excepturi facilis consequatur alias ea facere dignissimos quaerat quidem perferendis recusandae!
            </Page>
        );
    }

    componentDidMount() {
        this.$f7ready((f7) => {
            f7.$('.toolbar').show();
        });
    }
}