import React, { Component, Fragment } from "react";
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faList} from "@fortawesome/free-solid-svg-icons/faList";
import ReactDatatable from '@ashvin27/react-datatable';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import axios from "axios";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer} from "react-toastify";
import config from "../../config/config";

const serverUrl = config.serverUrl;
class Sessions extends Component {

    constructor(props) {
        super(props);

        this.perm = props.perm;
        this.columns = [
            // {
            //     key: "_id",
            //     text: "Id",
            //     className: "id",
            //     align: "left",
            //     sortable: true,
            // },
            {
                key: "chatid",
                text: "ChatID",
                className: "chatid",
                align: "left",
                sortable: true,
            },
            {
                key: "username",
                text: "Name",
                className: "username",
                align: "left",
                sortable: true,
            },
            {
                key: "type",
                text: "Type",
                className: "type",
                align: "left",
                sortable: true
            },
            {
                key: "adminid",
                text: "Admin ID",
                className: "adminid",
                align: "left",
                sortable: true
            },
            {
                key: "bullet_img",
                text: "Bullet",
                className: "bullet_img",
                align: "left",
                sortable: true
            },
            {
                key: "referral_link",
                text: "Referral Link",
                className: "referral_link",
                align: "left",
                sortable: true
            },
            // {
            //     key: "referral_of_owner",
            //     text: "Referral Of Owner",
            //     className: "referral_of_owner",
            //     align: "left",
            //     sortable: true
            // },
            {
                key: "action",
                text: "Action",
                className: "action",
                width: 100,
                align: "left",
                sortable: false,
                cell: record => {
                    return (
                        <Fragment>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => this.deleteRecord(record)}>
                                <i className="fa fa-trash"></i>
                            </button>
                        </Fragment>
                    );
                }
            }
        ];

        this.config = {
            page_size: 10,
            length_menu: [ 10, 20, 50 ],
            filename: "Sessions",
            no_data_text: 'No session found!',
            button: {
                excel: true,
                print: true,
                csv: true
            },
            language: {
                length_menu: "Show _MENU_ result per page",
                filter: "Filter in records...",
                info: "Showing _START_ to _END_ of _TOTAL_ records",
                pagination: {
                    first: "First",
                    previous: "Previous",
                    next: "Next",
                    last: "Last"
                }
            },
            show_length_menu: true,
            show_filter: true,
            show_pagination: true,
            show_info: true,
        };

        this.state = {
            records: []
        };

        this.state = {
            currentRecord: {
                id: '',
                chatid: '',
                username: '',
                type: '',
                adminid: '',
                bullet_img: '',
                referral_of_owner: '',
            }
        };

        this.getData = this.getData.bind(this);
    }

    componentDidMount() {

        this.getData()
    };

    componentWillReceiveProps(nextProps) {

        this.getData()
    }

    getData() {

        axios
            .post(serverUrl + "/api/session-data")
            .then(res => {
                this.setState({ records: res.data})
            })
            .catch()
    }

    deleteRecord(record) {
        axios
            .post(serverUrl + "/api/session-delete", {_id: record._id})
            .then(res => {
                if (res.status === 200) {
                   toast(res.data.message, {
                       position: toast.POSITION.TOP_CENTER,
                   })
                }
            })
            .catch();
        this.getData();
    }

    pageChange(pageData) {
        
    }

    render() {
        return (
            <div>
                <Navbar perm={this.perm}/>
                <div className="d-flex" id="wrapper">
                    <Sidebar perm={this.perm}/>
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <button className="btn btn-link mt-3" id="menu-toggle"><FontAwesomeIcon icon={faList}/></button>
                            <h1 className="mt-2 text-primary">Sessions List</h1>
                            <ReactDatatable
                                config={this.config}
                                records={this.state.records}
                                columns={this.columns}
                                onPageChange={this.pageChange.bind(this)}
                            />
                        </div>
                    </div>
                    <ToastContainer/>
                </div>
            </div>
        );
    }

}

Sessions.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    records: state.records
});

export default connect(
    mapStateToProps
)(Sessions);
