from math import ceil
from typing import Any, Dict, Generic, Sequence, Union, Optional, TypeVar, DefaultDict
from pydantic.generics import GenericModel

DataType = TypeVar("DataType")
T = TypeVar("T")


class IResponseBase(GenericModel, Generic[T]):
    message: str = ""
    meta: Dict = {}
    data: Optional[T]
    user: DefaultDict


class IGetResponseBase(IResponseBase[DataType], Generic[DataType]):
    message: str = "Data got correctly"


class IPostResponseBase(IResponseBase[DataType], Generic[DataType]):
    message: str = "Data created correctly"


class IPutResponseBase(IResponseBase[DataType], Generic[DataType]):
    message: str = "Data updated correctly"


class IDeleteResponseBase(IResponseBase[DataType], Generic[DataType]):
    message: str = "Data deleted correctly"


def create_response(
    data: Optional[DataType],
    user: Optional[DataType] = "",
    message: Optional[str] = "",
) -> Union[Dict[str, DataType], Dict[str, DataType], DataType]:
    body_response = {"data": data, "message": message, "user":user}
    # It returns a dictionary to avoid double
    # validation https://github.com/tiangolo/fastapi/issues/3021
    return {k: v for k, v in body_response.items() if v is not None}
