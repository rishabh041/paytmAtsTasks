import { showLoader, hideLoader } from "../components";
import { VIEW_CONFIGURATION } from "../../utils/ATS/constants.json";
import config from "../../utils/config";
import request from "../../utils/requests";
import { openViewDefaultModal, closeViewDefaultModal } from "../openModal";

/**
 *
 * @param {*} skuId
 * @return {*}
 */
export const fetchSkuDetails = (skuId) => {
  return (dispatch, getState) => {
    dispatch(showLoader());
    return request.get(config.getSupplierList(skuId)).then(
      (response) => {
        dispatch(hideLoader());
        const { data } = response.data;
        dispatch(
          success(
            { skuDetails: data, newSuppliersInfo: [] },
            VIEW_CONFIGURATION.SUCCESS
          )
        );
        return Promise.resolve(data);
      },
      (error) => {
        dispatch(hideLoader());
        const { resultMsg } =
          error.response &&
          error.response.data &&
          error.response.data.resultInfo;
        dispatch(
          openViewDefaultModal(
            resultMsg || error.message,
            "Error!",
            "default",
            "Ok",
            undefined,
            "50vw",
            "string"
          )
        );
        return Promise.reject(VIEW_CONFIGURATION.FAILURE);
      }
    );
  };
};

export const updateSkuDetails = (
  skipValidationEnum,
  suppliers,
  skuId
) => async (dispatch) => {
  console.log("updateSkuCalled");
  dispatch(showLoader());
  try {
    const body = {
      skipValidationEnum,
      suppliers,
      skuId
    };
    const url = config.updateSku;
    let response = await request.post(url, body);
    // updateSkuResponse = updateSkuResponse.data;
    console.log("updateSkuResponse", response);
    if (response.data.resultInfo.resultStatus === "S") {
      dispatch(
        openViewDefaultModal(
          "Sku details updated successfully",
          "Success!",
          "default",
          "Ok",
          undefined,
          "50vw",
          "string"
        )
      );
    } else {
      dispatch(
        openViewDefaultModal(
          response.data.resultInfo.resultMsg || "Something Went Wrong",
          "Error!",
          "default",
          "Ok",
          undefined,
          "50vw",
          "string"
        )
      );
    }
    dispatch(hideLoader());

    // if(updateSkuResponse.)
  } catch (error) {
    dispatch(hideLoader());
    console.log(error);
    const resultMsg =
      (error.response &&
        error.response.data &&
        error.response.data.resultInfo &&
        error.response.data.resultInfo.resultMsg) ||
      "Something Went Wrong";
    dispatch(
      openViewDefaultModal(
        resultMsg || error.message,
        "Error!",
        "default",
        "Ok",
        undefined,
        "50vw",
        "string"
      )
    );
  }
};

/**
 * action - Set Stage
 * @param {String} stage of the agent
 * @param {String} type of the agent
 * @return {void}
 */
export const setStage = (stage, type) => {
  return (dispatch, getState) => {
    dispatch(showLoader());
    dispatch(success({ stage }, type));
    setTimeout(() => {
      dispatch(hideLoader());
    }, 500);
  };
};

/**
 * action - dispatch data in store after successfull services API call.
 * @param {Object} data contains all services used in application
 * @param {Object} type
 * @return {void}
 */
export function success(data, type) {
  return {
    type,
    payload: data
  };
}
