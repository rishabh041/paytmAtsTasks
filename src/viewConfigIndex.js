import React, { Component } from "react";
import { connect } from "react-redux";
import { initialize } from "redux-form";
import store, { injectAsyncReducer } from "../../../../store";
import ViewConfiguration from "./component";
import Loader from "../../../common/loader";
import {
  updateSkuDetails,
  fetchSkuDetails,
  success,
  setStage
} from "../../../../actions/ATS/viewConfiguration";
import { fetchSupplier } from "../../../../actions/ATS/createSKU";
import {
  closeViewDefaultModal,
  openViewDefaultModal
} from "../../../../actions/openModal";
import {
  VIEW_CONFIGURATION,
  BARCODE,
  COMMON
} from "../../../../utils/ATS/constants.json";
import global from "../../../../utils/global";
import ATSCONSTANTS from "../../../../utils/ATS/ATSConstant";
import get from "lodash/get";
import filter from "lodash/filter";

const mapStateToProps = (store) => {
  return {
    stage: store.viewConfiguration && store.viewConfiguration.stage,
    skuId: store.viewConfiguration && store.viewConfiguration.skuId,
    stageList:
      (store.viewConfiguration && store.viewConfiguration.stageList) || [],
    skuDetails:
      (store.viewConfiguration && store.viewConfiguration.skuDetails) || {},
    newSuppliersInfo:
      (store.viewConfiguration && store.viewConfiguration.newSuppliersInfo) ||
      [],
    listOfMethods: global.typeOfMethod
  };
};

const mapDispatchToProps = (dispatch, props) => {
  /**
   * @override
   */
  function backToInitialState() {
    dispatch(success({}, COMMON.CLEAR_STAGE));
    dispatch(initialize(`${VIEW_CONFIGURATION.VIEW_CONFIGURATION_FORM}`, {}));
  }
  /**
   * @param {*} stageList
   */
  function backTO(stageList) {
    const prevStage = stageList[stageList.length - 1];
    if (stageList && Array.isArray(stageList) && stageList.length === 1) {
      dispatch(setStage(prevStage, COMMON.CLEAR_STAGE));
      dispatch(initialize(`${VIEW_CONFIGURATION.VIEW_CONFIGURATION_FORM}`, {}));
    } else if (stageList && Array.isArray(stageList) && stageList.length > 0) {
      dispatch(setStage(prevStage, COMMON.SET_STAGE));
      dispatch(
        success(
          { stage: prevStage, stageList: [...stageList.slice(0, length - 1)] },
          BARCODE.SUCCESS
        )
      );
    }
  }
  /**
   *
   * @param {*} values
   * @param {*} stageList
   */
  function handleSubmitSku(values, stageList) {
    const skuId = values.skuId;

    dispatch(
      success(
        {
          skuId,
          stageList: [...stageList, VIEW_CONFIGURATION.ENTER_SKU_SCREEN]
        },
        BARCODE.SUCCESS
      )
    );

    dispatch(fetchSkuDetails(skuId)).then(
      (response) => {
        dispatch(setStage(VIEW_CONFIGURATION.VIEW_SCREEN, COMMON.SET_STAGE));
      },
      (error) => {
        dispatch(
          setStage(VIEW_CONFIGURATION.ENTER_SKU_SCREEN, COMMON.SET_STAGE)
        );
      }
    );
  }
  const handleConfirmationSubmit = (stage, values) => {
    const currentState = store.getState();
    const storeSupplierPriceInfo = get(
      currentState,
      "viewConfiguration.skuDetails.suppliers",
      []
    );
    const newSuppliersInfo = get(
      currentState,
      "viewConfiguration.newSuppliersInfo",
      []
    );
    if (stage === "VIEW_SCREEN") {
      const supplierId = values.supplierId;
      dispatch(fetchSupplier(supplierId)).then(
        (response) => {
          const supplierRes = get(response, "data.data");
          const resultInfo = get(response, "data.resultInfo");

          if (resultInfo.resultStatus === "F" && supplierRes.length === 0) {
            dispatch(
              openViewDefaultModal(
                "Supplier with this ID does not exist",
                "Error!",
                "default",
                "Ok",
                undefined,
                "50vw",
                "string"
              )
            );
          } else {
            let suppliersInfo = [];
            let hasDuplicate =
              storeSupplierPriceInfo.some(function (el) {
                return el.id === supplierRes[0].id;
              }) ||
              newSuppliersInfo.some(function (el) {
                return el.id === supplierRes[0].id;
              });

            if (hasDuplicate) {
              dispatch(
                openViewDefaultModal(
                  "Already added in queue.",
                  "Error!",
                  "default",
                  "Ok",
                  undefined,
                  "50vw",
                  "string"
                )
              );
            } else {
              supplierRes[0].price = values.price;
              suppliersInfo = [...newSuppliersInfo, supplierRes[0]];

              dispatch(
                success({ newSuppliersInfo }, VIEW_CONFIGURATION.SUCCESS)
              );
              // dispatch(change("createSkuForm", "values.supplierId", supplierId))
              dispatch(closeViewDefaultModal());
            }
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  };
  const handleUpdate = (skipValidation, suppliersInfo, skuId) => {
    dispatch(updateSkuDetails(skipValidation, suppliersInfo, skuId));
  };
  const deleteSupplier = (index) => {
    const currentState = store.getState();
    console.log(currentState.viewConfiguration);
    const currSuppliersInfo = get(
      currentState,
      "viewConfiguration.newSuppliersInfo",
      []
    );
    console.log(currSuppliersInfo);
    let newSuppliersInfo = filter(currSuppliersInfo, function (data, idx) {
      return idx !== index;
    });
    dispatch(success({ newSuppliersInfo }, VIEW_CONFIGURATION.SUCCESS));
  };
  return {
    backTO,
    handleSubmitSku,
    backToInitialState,
    handleConfirmationSubmit,
    deleteSupplier,
    handleUpdate
  };
};
/**
 * @override
 */
class ViewConfigurationContainer extends Component {
  state = {
    editFlag: false,
    skipValidation:
      (this.props.skuDetails.skuDetails &&
        this.props.skuDetails.skuDetails.skipValidationEnum) ||
      "DISABLE"
  };
  /**
   * @override
   */
  componentDidMount() {
    if (this.props.location.search.includes("skuid")) {
      store.dispatch(
        setStage(VIEW_CONFIGURATION.VIEW_SCREEN, COMMON.SET_STAGE)
      );
    } else {
      store.dispatch(success({}, COMMON.CLEAR_STAGE));
    }

    if (this.props.location.search.includes("skuid")) {
      const skuId = this.props.location.search.slice(1).split("=")[1];
      this.props.handleSubmitSku({ skuId: skuId }, []);
    }
  }
  /**
   * @override
   */
  componentWillUnmount() {
    store.dispatch(success({}, COMMON.CLEAR_STAGE));
  }
  /**
   * @override
   */
  componentWillMount() {
    injectAsyncReducer(
      store,
      "viewConfiguration",
      require("../../../../reducers/ATS/viewConfiguration.js")
    );
  }

  // compareSuppliers = (currSuppliers, newSuppliers) => {
  //   const n1 = currSuppliers.length;
  //   const n2 = newSuppliers.length;
  //   let flag = false;
  //   if (n1 !== n2) flag = true;
  //   else {
  //     for (let i = 0; i < n1; i++) {
  //       const item1 = currSuppliers[0];
  //       const item2 = newSuppliers[0];
  //       if (item1.id !== item2.id || item1.price !== item2.price) {
  //         flag = true;
  //         break;
  //       }
  //     }
  //   }
  //   console.log("suppliersArr", flag);
  //   return flag;
  // };
  toggleEditFlag = () => {
    this.setState((prevState) => ({
      editFlag: !prevState.editFlag
    }));
  };
  handleSaveChanges = () => {
    this.toggleEditFlag();
    const currSkipValue =
      (this.props.skuDetails.skuDetails &&
        this.props.skuDetails.skuDetails.skipValidation) ||
      "DISABLE";
    // const currSuppliersInfo =
    //   (this.props.skuDetails && this.props.skuDetails.suppliers) || [];
    const newSkipValue = this.state.skipValidation;
    const newSuppliersInfo = this.props.newSuppliersInfo;
    const skuId = this.props.skuId;
    console.log(currSkipValue, newSkipValue);
    console.log(newSuppliersInfo);
    if (currSkipValue !== newSkipValue || newSuppliersInfo.length > 0) {
      this.props.handleUpdate(newSkipValue, newSuppliersInfo, skuId);
    }
  };
  submitSkipValidation = (event, index, value) => {
    console.log(event.target.value, index, value);
    const currValue = this.state.skipValidation;
    if (value && currValue !== value) {
      this.setState({
        skipValidation: value,
        editFlag: true
      });
    } else if (!value || this.state.editFlag) {
      this.setState({
        editFlag: false
      });
    }
  };
  /**xx
   * @override
   */
  render() {
    return (
      <div>
        <ViewConfiguration
          {...this.props}
          editFlag={this.state.editFlag}
          toggleEditFlag={this.toggleEditFlag}
          skipValidation={this.state.skipValidation}
          submitSkipValidation={this.submitSkipValidation}
          handleSaveChanges={this.handleSaveChanges}
        />
        <Loader />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewConfigurationContainer);
