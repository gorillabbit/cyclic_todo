import datetime
from pydantic import BaseModel
from typing import Optional, Any, Union


class Accounts(BaseModel):
    id: str
    receive_request: Optional[Union[list[str], str]] = None
    linked_accounts: Optional[Union[list[str], str]] = None
    name: str
    icon: str
    send_request: Optional[Union[list[str], str]] = None
    email: str
    use_tab_ids: Optional[Union[list[str], str]] = None

class Tabs(BaseModel):
    id: str
    name: str
    create_user_uid: str
    shared_accounts: Union[list[str], str]
    type: str
    timestamp: datetime.datetime
    user_id: str

class Tasks(BaseModel):
    id: str
    is周期的: Optional[str] = None
    周期単位: Optional[str] = None
    周期日数: Optional[int] = None
    due_date: Optional[str] = None
    has_due_time: Optional[bool] = None
    icon: Optional[str] = None
    description: Optional[str] = None
    task_text: Optional[str] = None
    due_time: Optional[str] = None
    user_id: str
    has_due: Optional[bool] = None
    timestamp: Optional[datetime.datetime] = None
    toggle_completion_timestamp: Optional[datetime.datetime] = None
    completed: Optional[bool] = None
    tab_id: str

class Logs(BaseModel):
    id: str
    available_voice_announce: bool
    tab_id: str
    interval_num: int
    available_memo: bool
    voice_announce_unit: str
    interval_unit: str
    icon: str
    description: Optional[str] = None
    user_id: str
    duration: bool
    archived: Optional[bool] = None
    accessible_accounts: Optional[Union[list[str], str]] = None
    voice_announce_num: int
    reviewed: Optional[bool] = None
    display_feature: Optional[Union[list[str], str]] = None
    is_interval: Optional[bool] = None
    task_text: Optional[str] = None
    timestamp: datetime.datetime

class LogsCompleteLogs(BaseModel):
    id: str
    processed: Optional[bool] = None
    memo: Optional[str] = None
    log_id: str
    type: str
    timestamp: datetime.datetime
    user_id: str
    tab_id: str

class Assets(BaseModel):
    id: str
    tab_id: str
    name: Optional[str] = None
    user_id: str
    timestamp: Optional[datetime.datetime] = None

class Methods(BaseModel):
    id: str
    timing_date: int
    tab_id: str
    asset_id: str
    timing: str
    user_id: str
    timestamp: Optional[datetime.datetime] = None
    label: str

class Purchases(BaseModel):
    id: str
    date: datetime.datetime
    income: Optional[bool] = None
    tab_id: str
    method: str
    price: Optional[int] = None
    description: str
    title: str
    category: Optional[str] = None
    user_id: str
    child_purchase_id: Optional[str] = None
    difference: Optional[int] = None
    asset_id: str
    pay_date: Optional[datetime.datetime] = None
    balance: Optional[int] = None
    timestamp: Optional[datetime.datetime] = None

class PurchaseSchedules(BaseModel):
    id: str
    date: int
    income: bool
    tab_id: str
    method: str
    end_date: datetime.datetime
    description: str
    title: str
    user_id: str
    cycle: str
    price: int
    is_uncertain: Optional[bool] = None
    category: str
    day: str
    timestamp: datetime.datetime

class PurchaseTemplates(BaseModel):
    id: str
    date: datetime.datetime
    income: bool
    tab_id: str
    method: str
    description: str
    title: str
    user_id: str
    price: int
    is_uncertain: Optional[bool] = None
    is_group: Optional[bool] = None
    category: str
    timestamp: datetime.datetime

class TransferTemplates(BaseModel):
    id: str
    date: datetime.datetime
    tab_id: str
    price: int
    description: str
    from_method: Optional[str] = None
    to_method: Optional[str] = None
    user_id: str
    timestamp: datetime.datetime