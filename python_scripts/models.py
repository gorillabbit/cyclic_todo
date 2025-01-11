from typing import Optional
from pydantic import BaseModel
import datetime


class Accounts(BaseModel):
    id: str
    receive_request: str
    linked_accounts: str
    name: str
    icon: str
    send_request: str
    email: str
    use_tab_ids: str


class Tabs(BaseModel):
    id: str
    name: str
    create_user_uid: str
    shared_accounts: str
    type: str
    timestamp: datetime.datetime
    user_id: str


class Tasks(BaseModel):
    id: str
    is周期的: str
    周期単位: str | None
    周期日数: int | None
    due_date: datetime.date
    has_due_time: bool
    icon: str
    description: str
    task_text: str
    due_time: str
    user_id: str
    has_due: bool
    timestamp: datetime.datetime
    toggle_completion_timestamp: datetime.datetime
    completed: bool
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
    description: str
    user_id: str
    duration: bool
    archived: bool
    accessible_accounts: str
    voice_announce_num: int
    reviewed: bool
    display_feature: str
    is_interval: bool
    task_text: str
    timestamp: datetime.datetime


class Logscompletelogs(BaseModel):
    id: str
    processed: bool
    memo: str
    log_id: str
    type: str
    timestamp: datetime.datetime
    user_id: str
    tab_id: str


class Assets(BaseModel):
    id: str
    tab_id: str
    name: str | None
    user_id: str
    timestamp: datetime.datetime | None


class Methods(BaseModel):
    id: str
    timing_date: int
    tab_id: str
    asset_id: str
    timing: str
    user_id: str
    timestamp: datetime.datetime | None
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
    category: str | None
    user_id: str
    child_purchase_id: Optional[str] = None
    difference: int | None
    asset_id: str
    pay_date: Optional[datetime.datetime] = None
    balance: int | None
    timestamp: Optional[datetime.datetime] = None


class Purchase_schedules(BaseModel):
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
    price: str
    is_uncertain: bool
    category: str
    day: str
    timestamp: datetime.datetime


class Purchase_templates(BaseModel):
    id: str
    date: datetime.datetime
    income: bool
    tab_id: str
    method: str
    description: str
    title: str
    user_id: str
    price: int
    is_uncertain: bool
    is_group: bool
    category: str
    timestamp: datetime.datetime


class Transfer_templates(BaseModel):
    id: str
    date: datetime.datetime
    tab_id: str
    price: int
    description: str
    from_method: str
    to_method: str
    user_id: str
    timestamp: datetime.datetime
