import React from "react";
import { RaisedButton, IconButton } from "material-ui";
import { Card, CardHeader } from "material-ui/Card";
import { Field } from "redux-form";
import renderField from "../../../common/renderFields";
import Close from "material-ui/svg-icons/navigation/close";
import styles from "./styles.scss";
import validate from "../../../../utils/ggAPP/validations";
import { openViewDefaultModal } from "../../../../actions/openModal";
import ATSCONSTANTS from "../../../../utils/ATS/ATSConstant";
import store from "../../../../store";
import ConfirmationModal from "../SKU/confirmationPopUp";
import Config from "./config.js";
import map from "lodash/map";
import get from "lodash/get";

const ViewConfiguration = (props) => {
  let {
    invalid,
    handleSubmit,
    stageList = [],
    deleteSupplier,
    handleConfirmationSubmit
  } = props;
  // console.log(props);
  const { editFlag, skipValidation, newSuppliersInfo } = props;
  console.log("skipValidation", skipValidation);
  const skuDetails = props.skuDetails.skuDetails || {};
  const enabledParams = get(props.skuDetails, "enabledParams", []);
  const suppliers = get(props.skuDetails, "suppliers", []);
  // const suppliers = props.suppliersInfo || [];
  const linkedSkuIds = get(props.skuDetails, "linkedSkuIds", []);
  let conf = Config();
  const skipValidationOptions = [
    { key: "DISABLE", value: "DISABLE" },
    {
      key: "BYPASS_FOR_EXISTING_BARCODE",
      value: "BYPASS FOR EXISTING BARCODE"
    },
    { key: "BYPASS_FOR_ALL_BARCODES", value: "BYPASS FOR ALL BARCODES" }
  ];
  const unitConfirmation = () => {
    store.dispatch(
      openViewDefaultModal(
        <ConfirmationModal
          stage={props.stage}
          handleConfirmationSubmit={handleConfirmationSubmit}
        />,
        "Add",
        "default",
        undefined,
        undefined,
        "50vw",
        "component",
        undefined
      )
    );
  };
  return (
    <div>
      <form
        className={`row col-12`}
        onSubmit={handleSubmit((values) =>
          props.getSeriesBarcodeStatusDetails(values)
        )}
      >
        {skuDetails && (
          <Card className={`col-12 cardLayout`}>
            <CardHeader
              title={"SKU Details"}
              actAsExpander={false}
              showExpandableButton={false}
            />
            <div className={styles["owner-details__selected-leads"]}>
              <div className="row container-fluid">
                {skuDetails &&
                  map(skuDetails, (data, index) => {
                    return (
                      <div
                        className={`col-md-6 ${styles["owner-details__info"]}`}
                        key={index}
                      >
                        <div
                          className={`col-6 ${styles["owner-details__label"]}`}
                        >
                          {conf[index] + " : "}
                          <span className={`${styles["owner-details__value"]}`}>
                            {typeof data === "boolean" ? String(data) : data}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </Card>
        )}
        {editFlag && (
          <div style={{ fontWeight: 400, marginTop: "20px" }}>
            <a onClick={unitConfirmation} style={{ cursor: "pointer" }}>
              Click to Add Supplier and Price
            </a>
          </div>
        )}
        {suppliers && suppliers.length > 0 && (
          <Card className={`col-12 cardLayout`}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <CardHeader
                title={"Suppliers"}
                actAsExpander={false}
                showExpandableButton={false}
              />
              <RaisedButton
                label={ATSCONSTANTS.BUTTON.EDIT}
                type="button"
                disabled={editFlag}
                style={{ minWidth: "150px" }}
                className={`button__secondary`}
                onClick={() => props.toggleEditFlag()}
              />
            </div>
            <div className={styles["owner-details__selected-leads"]}>
              <div className="container-fluid">
                {suppliers &&
                  map(suppliers, (data, index) => {
                    return (
                      <div
                        className={`row ${styles["owner-details__info"]}`}
                        key={index}
                      >
                        <div
                          className={`col-4 ${styles["owner-details__label"]}`}
                        >
                          {`Supplier_${index + 1}_Name` + " : "}
                          <span className={`${styles["owner-details__value"]}`}>
                            {data.name}
                          </span>
                        </div>
                        <div
                          className={`col-2 ${styles["owner-details__label"]}`}
                        >
                          {`id` + " : "}
                          <span className={`${styles["owner-details__value"]}`}>
                            {data.id}
                          </span>
                        </div>
                        <div
                          className={`col-6 `}
                          style={{ display: "contents" }}
                        >
                          {data.price && (
                            <div
                              className={`col-4 ${styles["owner-details__label"]}`}
                            >
                              {`Supplier_${index + 1}_Price` + " : "}
                              <span
                                className={`${styles["owner-details__value"]}`}
                              >
                                {data.price}
                              </span>
                            </div>
                          )}
                          {/* {editFlag && (
                            <div
                              className={`col-2`}
                              onClick={() => deleteSupplier(index)}
                            >
                              <IconButton
                                className={`${styles["business-onboarding__search-button"]}`}
                              >
                                <Close />
                              </IconButton>
                            </div>
                          )} */}
                        </div>
                      </div>
                    );
                  })}
                {newSuppliersInfo &&
                  map(newSuppliersInfo, (data, index) => {
                    return (
                      <div
                        className={`row ${styles["owner-details__info"]}`}
                        key={index}
                      >
                        <div
                          className={`col-4 ${styles["owner-details__label"]}`}
                        >
                          {`Supplier_${index + 1}_Name` + " : "}
                          <span className={`${styles["owner-details__value"]}`}>
                            {data.name}
                          </span>
                        </div>
                        <div
                          className={`col-2 ${styles["owner-details__label"]}`}
                        >
                          {`id` + " : "}
                          <span className={`${styles["owner-details__value"]}`}>
                            {data.id}
                          </span>
                        </div>
                        <div
                          className={`col-6 `}
                          style={{ display: "contents" }}
                        >
                          {data.price && (
                            <div
                              className={`col-4 ${styles["owner-details__label"]}`}
                            >
                              {`Supplier_${index + 1}_Price` + " : "}
                              <span
                                className={`${styles["owner-details__value"]}`}
                              >
                                {data.price}
                              </span>
                            </div>
                          )}
                          {editFlag && (
                            <div
                              className={`col-2`}
                              onClick={() => deleteSupplier(index)}
                            >
                              <IconButton
                                className={`${styles["business-onboarding__search-button"]}`}
                              >
                                <Close />
                              </IconButton>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </Card>
        )}
        {enabledParams && enabledParams.length > 0 && (
          <Card className={`col-12 cardLayout`}>
            <CardHeader
              title={"Enabled Params"}
              actAsExpander={false}
              showExpandableButton={false}
            />
            <div className={styles["owner-details__selected-leads"]}>
              <div className="container-fluid">
                {enabledParams &&
                  map(enabledParams, (data, index) => {
                    return (
                      <div
                        className={`row ${styles["owner-details__info"]}`}
                        key={index}
                      >
                        <div
                          className={`col-6 ${styles["owner-details__label"]}`}
                        >
                          {index + 1 + " : "}
                          <span className={`${styles["owner-details__value"]}`}>
                            {data.displayName}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </Card>
        )}
        {linkedSkuIds && linkedSkuIds.length > 0 && (
          <Card className={`col-12 cardLayout`}>
            <CardHeader
              title={"Linked SKU Ids"}
              actAsExpander={false}
              showExpandableButton={false}
            />
            <div className={styles["owner-details__selected-leads"]}>
              <div className="container-fluid">
                {linkedSkuIds &&
                  map(linkedSkuIds, (data, index) => {
                    return (
                      <div
                        className={`row ${styles["owner-details__info"]}`}
                        key={index}
                      >
                        <div
                          className={`col-6 ${styles["owner-details__label"]}`}
                        >
                          {index + 1 + " : "}
                          <span className={`${styles["owner-details__value"]}`}>
                            {data}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </Card>
        )}
        <Card style={{ marginTop: "10px" }} className={`col-12 cardLayout`}>
          <CardHeader
            title="Skip Validation"
            style={{
              paddingBottom: "10px",
              paddingTop: "10px",
              fontWeight: 500
            }}
          />
          <div
            style={{ width: "60%", paddingLeft: "40px", marginBottom: "20px" }}
          >
            <Field
              type={"select"}
              selectValue={skipValidation}
              options={skipValidationOptions}
              hintText={"testing"}
              component={renderField}
              className="filter__searchBy"
              name={"skipValidation"}
              onChangeAction={(event, index, value) =>
                props.submitSkipValidation(event, index, value)
              }
              validate={validate.required}
            />
          </div>
        </Card>
        <div
          className={`row col-12 ${styles["supplier__button-container"]}`}
          style={{ justifyContent: "flex-end" }}
        >
          <div>
            <RaisedButton
              label={ATSCONSTANTS.BUTTON.SAVE}
              primary={true}
              type="submit"
              style={{ minWidth: "150px" }}
              className={`button__primary`}
              disabled={!editFlag}
              onClick={props.handleSaveChanges}
            />
            <RaisedButton
              label={ATSCONSTANTS.BUTTON.BACK}
              type="button"
              style={{ minWidth: "150px" }}
              className={`button__secondary`}
              onClick={() => props.backTO(stageList)}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default ViewConfiguration;
